#!/usr/bin/env python3
from __future__ import annotations
import io, json, math, zipfile, warnings
from pathlib import Path
import numpy as np
import pandas as pd
import requests

BASE='https://data.binance.vision/data/futures/um'
COLS=['open_time','open','high','low','close','volume','close_time','quote_volume','count','taker_buy_volume','taker_buy_quote_volume','ignore']
OUT=Path('quant_results'); OUT.mkdir(exist_ok=True)
COST_FRAC=0.0014  # 14 bps round trip: 5 bps fee + 2 bps slippage per side
TARGET_R=3.0
STARTS={'PLTRUSDT':pd.Timestamp('2026-02-09',tz='UTC'),'SPCXUSDT':pd.Timestamp('2026-06-15',tz='UTC')}
END=pd.Timestamp('2026-08-11 23:59:59',tz='UTC')

def getzip(url):
    r=requests.get(url,timeout=30)
    if r.status_code==404: return None
    r.raise_for_status()
    with zipfile.ZipFile(io.BytesIO(r.content)) as z:
        name=[n for n in z.namelist() if n.endswith('.csv')][0]
        b=z.read(name)
    d=pd.read_csv(io.BytesIO(b),header=None)
    if str(d.iloc[0,0]).lower() in ('open_time','open time'):
        d=d.iloc[1:].reset_index(drop=True)
    d=d.iloc[:,:12]; d.columns=COLS
    return d

def norm(d):
    # Binance futures bulk klines use millisecond timestamps.
    t=pd.to_numeric(d.open_time,errors='coerce')
    # Defensive support if a future archive switches units.
    med=float(t.dropna().median())
    unit='us' if med>1e14 else 'ms'
    d=d.copy(); d['open_time']=pd.to_datetime(t,unit=unit,utc=True,errors='coerce')
    for c in ['open','high','low','close','volume','quote_volume','taker_buy_volume','taker_buy_quote_volume']:
        d[c]=pd.to_numeric(d[c],errors='coerce')
    return d.dropna(subset=['open_time','open','high','low','close','volume'])[['open_time','open','high','low','close','volume','quote_volume','taker_buy_volume','taker_buy_quote_volume']]

def load(symbol,start,end):
    parts=[]
    # Monthly files for complete months.
    cur=pd.Timestamp(start.year,start.month,1,tz='UTC')
    last=pd.Timestamp(end.year,end.month,1,tz='UTC')
    covered=set()
    while cur<=last:
        ym=cur.strftime('%Y-%m')
        url=f'{BASE}/monthly/klines/{symbol}/1m/{symbol}-1m-{ym}.zip'
        try: d=getzip(url)
        except Exception as e:
            print('monthly fetch error',url,repr(e)); d=None
        if d is not None and len(d):
            x=norm(d); parts.append(x)
            covered.update(pd.DatetimeIndex(x.open_time.dt.floor('D')).strftime('%Y-%m-%d'))
            print(symbol,ym,'monthly',len(x))
        cur += pd.offsets.MonthBegin(1)
    # Daily fallback for partial/unpublished month files.
    day=start.floor('D')
    while day<=end.floor('D'):
        ds=day.strftime('%Y-%m-%d')
        if ds not in covered:
            url=f'{BASE}/daily/klines/{symbol}/1m/{symbol}-1m-{ds}.zip'
            try: d=getzip(url)
            except Exception as e:
                print('daily fetch error',url,repr(e)); d=None
            if d is not None and len(d): parts.append(norm(d))
        day += pd.Timedelta(days=1)
    if not parts: raise RuntimeError(f'No data for {symbol}')
    x=pd.concat(parts,ignore_index=True).drop_duplicates('open_time').sort_values('open_time')
    x=x[(x.open_time>=start)&(x.open_time<=end)].reset_index(drop=True)
    print(symbol,'TOTAL',len(x),x.open_time.min(),x.open_time.max())
    return x

def resample5(d):
    x=d.set_index('open_time').resample('5min',label='left',closed='left').agg(
        open=('open','first'),high=('high','max'),low=('low','min'),close=('close','last'),
        volume=('volume','sum'),quote_volume=('quote_volume','sum'),
        taker_buy_volume=('taker_buy_volume','sum'),taker_buy_quote_volume=('taker_buy_quote_volume','sum'))
    return x.dropna(subset=['open','close']).reset_index()

def feat(d):
    x=d.copy(); c=x.close; h=x.high; l=x.low; o=x.open; v=x.volume
    x['ema9']=c.ewm(span=9,adjust=False).mean(); x['ema20']=c.ewm(span=20,adjust=False).mean(); x['ema50']=c.ewm(span=50,adjust=False).mean()
    x['ema50s']=x.ema50.pct_change(10)
    pc=c.shift(1); tr=pd.concat([h-l,(h-pc).abs(),(l-pc).abs()],axis=1).max(axis=1)
    x['atr']=tr.ewm(alpha=1/14,adjust=False).mean(); x['atrp']=x.atr/c
    de=c.diff(); g=de.clip(lower=0).ewm(alpha=1/14,adjust=False).mean(); ls=(-de.clip(upper=0)).ewm(alpha=1/14,adjust=False).mean(); rs=g/ls.replace(0,np.nan)
    x['rsi']=100-100/(1+rs)
    tp=(h+l+c)/3; ny=x.open_time.dt.tz_convert('America/New_York'); sd=ny.dt.date
    x['vwap']=(tp*v).groupby(sd).cumsum()/v.groupby(sd).cumsum().replace(0,np.nan)
    x['rvol']=v/v.rolling(20).median().replace(0,np.nan)
    x['hh20']=h.shift(1).rolling(20).max(); x['ll20']=l.shift(1).rolling(20).min(); x['hh10']=h.shift(1).rolling(10).max(); x['ll10']=l.shift(1).rolling(10).min()
    rg=(h-l).replace(0,np.nan); x['closepos']=(c-l)/rg
    x['nyhour']=ny.dt.hour; x['nymin']=ny.dt.minute; x['nywd']=ny.dt.weekday
    x['minute']=x.nyhour*60+x.nymin
    return x

def sess(x,name):
    m=x.minute; wd=x.nywd<5
    if name=='rth': return wd&(m>=570)&(m<960)
    if name=='open2h': return wd&(m>=570)&(m<690)
    if name=='close2h': return wd&(m>=840)&(m<960)
    if name=='all_weekday': return wd
    raise ValueError(name)

def sigmask(x,strategy,p,direction):
    up=(x.close>x.ema50)&(x.ema20>x.ema50)&(x.ema50s>0)
    dn=(x.close<x.ema50)&(x.ema20<x.ema50)&(x.ema50s<0)
    if strategy=='vwap_pullback':
        near=(x.close-x.vwap).abs()<=p['tol']*x.atr
        if direction==1: z=up&near&(x.low<=x.vwap)&(x.close>x.vwap)&x.rsi.between(p['rlo'],p['rhi'])&(x.close>x.open)
        else: z=dn&near&(x.high>=x.vwap)&(x.close<x.vwap)&x.rsi.between(100-p['rhi'],100-p['rlo'])&(x.close<x.open)
    elif strategy=='ema_pullback':
        near=(x.close-x.ema20).abs()<=p['tol']*x.atr
        if direction==1: z=up&near&(x.low<=x.ema20)&(x.close>x.ema20)&(x.rvol>=p['rv'])
        else: z=dn&near&(x.high>=x.ema20)&(x.close<x.ema20)&(x.rvol>=p['rv'])
    elif strategy=='breakout':
        if direction==1: z=up&(x.close>x.hh20)&(x.rvol>=p['rv'])&(x.closepos>=p['cp'])
        else: z=dn&(x.close<x.ll20)&(x.rvol>=p['rv'])&(x.closepos<=1-p['cp'])
    elif strategy=='sweep_reclaim':
        if direction==1: z=(x.low<x.ll10)&(x.close>x.ll10)&(x.closepos>=p['cp'])&(x.rvol>=p['rv'])&(x.close>x.ema50)
        else: z=(x.high>x.hh10)&(x.close<x.hh10)&(x.closepos<=1-p['cp'])&(x.rvol>=p['rv'])&(x.close<x.ema50)
    elif strategy=='vwap_mean_revert':
        stretch=(x.close-x.vwap)/x.atr.replace(0,np.nan)
        flat=x.ema50s.abs()<=0.004
        if direction==1: z=flat&(stretch<=-p['st'])&(x.rsi<=p['rsi'])&(x.closepos>=0.55)
        else: z=flat&(stretch>=p['st'])&(x.rsi>=100-p['rsi'])&(x.closepos<=0.45)
    else: raise ValueError(strategy)
    z=z&sess(x,p['session'])
    # fire on condition transition only to reduce duplicate correlated entries
    return (z&~z.shift(1,fill_value=False)).fillna(False).to_numpy()

def split_masks(x):
    days=pd.Index(x.open_time.dt.floor('D').unique()).sort_values(); n=len(days)
    d1=days[max(1,int(n*.60))-1]; d2=days[max(2,int(n*.80))-1]
    dates=x.open_time.dt.floor('D')
    return {'train':(dates<=d1).to_numpy(),'val':((dates>d1)&(dates<=d2)).to_numpy(),'test':(dates>d2).to_numpy()},d1,d2

def sim(x,signals,region,direction,stop_atr,horizon):
    O=x.open.to_numpy(float); H=x.high.to_numpy(float); L=x.low.to_numpy(float); C=x.close.to_numpy(float); A=x.atr.to_numpy(float)
    t=x.open_time.to_numpy(); idx=np.flatnonzero(signals&region)
    trades=[]; blocked_until=-1; n=len(x)
    for i in idx:
        if i<=blocked_until or i+1>=n or not region[i+1] or not np.isfinite(A[i]) or A[i]<=0: continue
        e=i+1; entry=O[e]; risk=stop_atr*A[i]; sp=risk/entry
        if sp<=COST_FRAC*1.25: continue
        stop=entry-direction*risk; target=entry+direction*TARGET_R*risk
        last=min(e+horizon-1,n-1); gross=None; out='timeout'; ex=last
        for j in range(e,last+1):
            if not region[j]: last=j-1; break
            hs = (L[j]<=stop) if direction==1 else (H[j]>=stop)
            ht = (H[j]>=target) if direction==1 else (L[j]<=target)
            if hs and ht: gross=-1.; out='stop_amb'; ex=j; break
            if hs: gross=-1.; out='stop'; ex=j; break
            if ht: gross=3.; out='target'; ex=j; break
        if gross is None:
            ex=max(e,last); gross=direction*(C[ex]-entry)/risk
        costr=COST_FRAC/sp; net=gross-costr
        trades.append((net,gross,out,sp,e,ex))
        blocked_until=ex
    return trades

def met(tr):
    if not tr: return {'n':0,'ev':-999}
    r=np.array([a[0] for a in tr]); gross=np.array([a[1] for a in tr]); outs=np.array([a[2] for a in tr]);
    wins=outs=='target'; pos=r[r>0].sum(); neg=-r[r<0].sum(); eq=np.cumsum(r); peak=np.maximum.accumulate(np.r_[0,eq]); dd=(np.r_[0,eq]-peak).min()
    # Longest consecutive negative-net streak
    best=cur=0
    for q in r<0: cur=cur+1 if q else 0; best=max(best,cur)
    n=len(r); ph=wins.mean(); z=1.96; den=1+z*z/n; wlb=(ph+z*z/(2*n)-z*math.sqrt((ph*(1-ph)+z*z/(4*n))/n))/den
    return {'n':n,'target_rate':float(ph),'wilson_lb':float(wlb),'ev':float(r.mean()),'sum_r':float(r.sum()),'pf':float(pos/neg) if neg else 99.,'maxdd_r':float(-dd),'loss_streak':int(best),'avg_stop_pct':float(np.mean([a[3] for a in tr]))}

def bootstrap(tr,reps=4000,seed=7):
    r=np.array([a[0] for a in tr]);
    if len(r)<2:return (np.nan,np.nan)
    rng=np.random.default_rng(seed); means=np.array([rng.choice(r,len(r),replace=True).mean() for _ in range(reps)])
    return tuple(np.quantile(means,[.025,.975]))

def grid():
    out=[]
    for se in ['rth','open2h','close2h','all_weekday']:
        for tol in [.20,.35,.50]:
            for rlo,rhi in [(45,62),(48,65)]: out.append(('vwap_pullback',{'session':se,'tol':tol,'rlo':rlo,'rhi':rhi}))
        for tol in [.20,.35,.50]:
            for rv in [1.0,1.3,1.6]: out.append(('ema_pullback',{'session':se,'tol':tol,'rv':rv}))
        for rv in [1.2,1.5,2.0]:
            for cp in [.65,.75]: out.append(('breakout',{'session':se,'rv':rv,'cp':cp}))
        for rv in [1.0,1.4,1.8]:
            for cp in [.65,.75]: out.append(('sweep_reclaim',{'session':se,'rv':rv,'cp':cp}))
        for st in [1.0,1.5,2.0]:
            for rr in [25,30,35]: out.append(('vwap_mean_revert',{'session':se,'st':st,'rsi':rr}))
    return out

def run_one(raw,symbol,tf):
    x=feat(raw if tf=='1m' else resample5(raw)); regions,d1,d2=split_masks(x)
    hvals=[30,60] if tf=='1m' else [6,12]  # 30/60 minutes
    train=[]
    for strat,p in grid():
        for direction in [1,-1]:
            sg=sigmask(x,strat,p,direction)
            if sg.sum()<20: continue
            for sa in [.6,.8,1.0,1.2]:
                for hor in hvals:
                    tr=sim(x,sg,regions['train'],direction,sa,hor); m=met(tr)
                    if m['n']<25: continue
                    score=m['ev']*math.sqrt(m['n'])-.02*m['maxdd_r']
                    train.append({'strategy':strat,'params':json.dumps(p,sort_keys=True),'direction':'long' if direction==1 else 'short','stop_atr':sa,'horizon':hor,'train_score':score,**{'train_'+k:v for k,v in m.items()}})
    if not train: return []
    td=pd.DataFrame(train).sort_values('train_score',ascending=False).head(35)
    vals=[]
    for _,r in td.iterrows():
        p=json.loads(r.params); direction=1 if r.direction=='long' else -1; sg=sigmask(x,r.strategy,p,direction)
        tr=sim(x,sg,regions['val'],direction,float(r.stop_atr),int(r.horizon)); m=met(tr)
        q=r.to_dict(); q.update({'val_'+k:v for k,v in m.items()}); vals.append(q)
    vd=pd.DataFrame(vals)
    eligible=vd[(vd.val_n>=8)&(vd.val_ev>0)].copy()
    if eligible.empty: eligible=vd.copy()
    # validation selection only; test untouched until this point
    eligible['val_rank_score']=eligible.val_ev*np.sqrt(eligible.val_n.clip(lower=1)) + .25*eligible.val_wilson_lb
    finalists=eligible.sort_values(['val_rank_score','val_ev'],ascending=False).head(5)
    finals=[]
    for _,r in finalists.iterrows():
        p=json.loads(r.params); direction=1 if r.direction=='long' else -1; sg=sigmask(x,r.strategy,p,direction)
        tr=sim(x,sg,regions['test'],direction,float(r.stop_atr),int(r.horizon)); m=met(tr); lo,hi=bootstrap(tr)
        q=r.to_dict(); q.update({'symbol':symbol,'tf':tf,'train_end':str(d1),'val_end':str(d2),**{'test_'+k:v for k,v in m.items()},'test_ev_ci_low':lo,'test_ev_ci_high':hi})
        # 3% equity-risk compounding on actual net R sequence.
        eq=1000.; peak=1000.; maxdd=0.
        for rr in [a[0] for a in tr]:
            eq*=max(.01,1+.03*rr); peak=max(peak,eq); maxdd=max(maxdd,1-eq/peak)
        q['test_equity_3pct']=eq; q['test_equity_maxdd_pct']=maxdd
        finals.append(q)
    return finals

def main():
    allres=[]
    for sym in ['PLTRUSDT','SPCXUSDT']:
        raw=load(sym,STARTS[sym],END)
        raw.to_parquet(OUT/f'{sym}_1m.parquet',index=False)
        for tf in ['1m','5m']:
            print('\nRUN',sym,tf)
            r=run_one(raw,sym,tf); allres.extend(r)
    df=pd.DataFrame(allres)
    if len(df):
        df['credible']=((df.test_n>=20)&(df.test_ev>0)&(df.test_ev_ci_low>=0))
        df=df.sort_values(['credible','test_ev_ci_low','test_ev','test_n'],ascending=[False,False,False,False])
        df.to_csv(OUT/'FINAL_TOURNAMENT.csv',index=False)
        cols=['symbol','tf','strategy','direction','params','stop_atr','horizon','test_n','test_target_rate','test_wilson_lb','test_ev','test_ev_ci_low','test_ev_ci_high','test_pf','test_maxdd_r','test_loss_streak','test_avg_stop_pct','test_equity_3pct','test_equity_maxdd_pct','credible']
        print('\n=== FINAL STATISTICAL TOURNAMENT ===')
        print(df[cols].to_string(index=False))
        with open(OUT/'summary.json','w') as f: json.dump(df[cols].to_dict(orient='records'),f,indent=2,default=str)
    else: print('NO RESULTS')

if __name__=='__main__': main()
