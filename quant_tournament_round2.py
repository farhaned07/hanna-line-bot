#!/usr/bin/env python3
from __future__ import annotations
import io, json, math, zipfile
from pathlib import Path
import numpy as np
import pandas as pd
import requests

BASE='https://data.binance.vision/data/futures/um'
COLS=['open_time','open','high','low','close','volume','close_time','quote_volume','count','taker_buy_volume','taker_buy_quote_volume','ignore']
OUT=Path('quant_results_round2'); OUT.mkdir(exist_ok=True)
TARGET_R=3.0
COST_FRAC=0.0014  # 14 bps round-trip research assumption
STARTS={'PLTRUSDT':pd.Timestamp('2026-02-09',tz='UTC'),'SPCXUSDT':pd.Timestamp('2026-06-15',tz='UTC')}
END=pd.Timestamp('2026-08-12 23:59:59',tz='UTC')


def getzip(url):
    r=requests.get(url,timeout=30)
    if r.status_code==404: return None
    r.raise_for_status()
    with zipfile.ZipFile(io.BytesIO(r.content)) as z:
        names=[n for n in z.namelist() if n.endswith('.csv')]
        if not names: return None
        d=pd.read_csv(io.BytesIO(z.read(names[0])),header=None)
    if len(d) and str(d.iloc[0,0]).lower() in ('open_time','open time'):
        d=d.iloc[1:].reset_index(drop=True)
    d=d.iloc[:,:12]; d.columns=COLS
    return d


def norm(d):
    t=pd.to_numeric(d.open_time,errors='coerce')
    med=float(t.dropna().median()); unit='us' if med>1e14 else 'ms'
    x=d.copy(); x['open_time']=pd.to_datetime(t,unit=unit,utc=True,errors='coerce')
    for c in ['open','high','low','close','volume','quote_volume','taker_buy_volume','taker_buy_quote_volume']:
        x[c]=pd.to_numeric(x[c],errors='coerce')
    return x.dropna(subset=['open_time','open','high','low','close','volume'])[['open_time','open','high','low','close','volume','quote_volume','taker_buy_volume','taker_buy_quote_volume']]


def load(symbol,start,end):
    parts=[]; covered=set(); cur=pd.Timestamp(start.year,start.month,1,tz='UTC'); last=pd.Timestamp(end.year,end.month,1,tz='UTC')
    while cur<=last:
        ym=cur.strftime('%Y-%m'); url=f'{BASE}/monthly/klines/{symbol}/1m/{symbol}-1m-{ym}.zip'
        try: d=getzip(url)
        except Exception as e: print('monthly error',url,repr(e)); d=None
        if d is not None and len(d):
            x=norm(d); parts.append(x); covered.update(x.open_time.dt.strftime('%Y-%m-%d').unique())
            print(symbol,ym,'monthly',len(x))
        cur += pd.offsets.MonthBegin(1)
    day=start.floor('D')
    while day<=end.floor('D'):
        ds=day.strftime('%Y-%m-%d')
        if ds not in covered:
            url=f'{BASE}/daily/klines/{symbol}/1m/{symbol}-1m-{ds}.zip'
            try: d=getzip(url)
            except Exception: d=None
            if d is not None and len(d): parts.append(norm(d))
        day += pd.Timedelta(days=1)
    if not parts: raise RuntimeError(f'No data for {symbol}')
    x=pd.concat(parts,ignore_index=True).drop_duplicates('open_time').sort_values('open_time')
    x=x[(x.open_time>=start)&(x.open_time<=end)].reset_index(drop=True)
    print('LOADED',symbol,len(x),x.open_time.min(),x.open_time.max())
    return x


def resample5(d):
    x=d.set_index('open_time').resample('5min',label='left',closed='left').agg(
        open=('open','first'),high=('high','max'),low=('low','min'),close=('close','last'),volume=('volume','sum'),
        quote_volume=('quote_volume','sum'),taker_buy_volume=('taker_buy_volume','sum'),taker_buy_quote_volume=('taker_buy_quote_volume','sum'))
    return x.dropna(subset=['open','close']).reset_index()


def features(d):
    x=d.copy(); c=x.close; h=x.high; l=x.low; o=x.open; v=x.volume
    x['ema9']=c.ewm(span=9,adjust=False).mean(); x['ema20']=c.ewm(span=20,adjust=False).mean(); x['ema50']=c.ewm(span=50,adjust=False).mean(); x['ema200']=c.ewm(span=200,adjust=False).mean()
    x['ema50s']=x.ema50.pct_change(10); x['ema20s']=x.ema20.pct_change(5)
    pc=c.shift(1); tr=pd.concat([h-l,(h-pc).abs(),(l-pc).abs()],axis=1).max(axis=1)
    x['atr']=tr.ewm(alpha=1/14,adjust=False).mean(); x['atrp']=x.atr/c
    x['atr_regime']=x.atrp/x.atrp.rolling(120,min_periods=40).median().replace(0,np.nan)
    de=c.diff(); gain=de.clip(lower=0).ewm(alpha=1/14,adjust=False).mean(); loss=(-de.clip(upper=0)).ewm(alpha=1/14,adjust=False).mean(); rs=gain/loss.replace(0,np.nan)
    x['rsi']=100-100/(1+rs)
    ny=x.open_time.dt.tz_convert('America/New_York'); x['session_day']=ny.dt.date; x['nywd']=ny.dt.weekday; x['minute']=ny.dt.hour*60+ny.dt.minute
    tp=(h+l+c)/3; day=x.session_day
    x['vwap']=(tp*v).groupby(day).cumsum()/v.groupby(day).cumsum().replace(0,np.nan)
    x['vwap_atr']=(c-x.vwap)/x.atr.replace(0,np.nan)
    x['rvol']=v/v.rolling(20,min_periods=10).median().replace(0,np.nan)
    x['buy_frac']=x.taker_buy_volume/v.replace(0,np.nan); x['buy_frac']=x.buy_frac.fillna(.5).clip(0,1)
    x['buy_flow5']=x.buy_frac.ewm(span=5,adjust=False).mean()
    x['hh5']=h.shift(1).rolling(5).max(); x['ll5']=l.shift(1).rolling(5).min()
    x['hh10']=h.shift(1).rolling(10).max(); x['ll10']=l.shift(1).rolling(10).min()
    x['hh20']=h.shift(1).rolling(20).max(); x['ll20']=l.shift(1).rolling(20).min()
    rng=(h-l).replace(0,np.nan); x['closepos']=(c-l)/rng; x['bodyfrac']=(c-o).abs()/rng
    x['lowerwick']=(np.minimum(o,c)-l)/rng; x['upperwick']=(h-np.maximum(o,c))/rng
    x['range_atr']=rng/x.atr.replace(0,np.nan)
    # 15-minute opening range. It is only used after 09:45 ET, so no look-ahead in signals.
    orm=(x.nywd<5)&(x.minute>=570)&(x.minute<585)
    x['or15_hi']=h.where(orm).groupby(day).transform('max'); x['or15_lo']=l.where(orm).groupby(day).transform('min')
    x['prev_close']=c.shift(1)
    return x


def session(x,name):
    m=x.minute; wd=x.nywd<5
    if name=='open90': return wd&(m>=570)&(m<660)
    if name=='open2h': return wd&(m>=570)&(m<690)
    if name=='post_or90': return wd&(m>=585)&(m<660)
    if name=='rth': return wd&(m>=570)&(m<960)
    if name=='close2h': return wd&(m>=840)&(m<960)
    raise ValueError(name)


def configs():
    # Predetermined, interpretable variants. Round 2 intentionally narrows the search
    # around the previous PLTR sweep/reclaim lead while adding order-flow and regime filters.
    return [
      ('sweep_flow',{'session':'open90','lb':10,'sweep':.05,'cp':.70,'rv':1.0,'flow':.52,'vwap':'near','trend':'ema'}),
      ('sweep_flow',{'session':'open90','lb':10,'sweep':.10,'cp':.75,'rv':1.2,'flow':.54,'vwap':'near','trend':'ema'}),
      ('sweep_flow',{'session':'open2h','lb':10,'sweep':.05,'cp':.72,'rv':1.0,'flow':.52,'vwap':'above','trend':'ema'}),
      ('sweep_flow',{'session':'open2h','lb':20,'sweep':.05,'cp':.72,'rv':1.2,'flow':.54,'vwap':'near','trend':'ema'}),
      ('sweep_flow',{'session':'open2h','lb':10,'sweep':.15,'cp':.78,'rv':1.3,'flow':.56,'vwap':'near','trend':'none'}),
      ('vwap_reclaim',{'session':'open90','cp':.68,'rv':1.0,'flow':.53,'trend':'ema'}),
      ('vwap_reclaim',{'session':'open2h','cp':.72,'rv':1.2,'flow':.55,'trend':'ema'}),
      ('vwap_reclaim',{'session':'rth','cp':.75,'rv':1.4,'flow':.56,'trend':'ema'}),
      ('orb15_flow',{'session':'post_or90','cp':.70,'rv':1.2,'flow':.54,'trend':'ema'}),
      ('orb15_flow',{'session':'post_or90','cp':.76,'rv':1.5,'flow':.57,'trend':'ema'}),
      ('compression_breakout',{'session':'open2h','lb':20,'cp':.72,'rv':1.4,'flow':.55,'atrmax':.95,'range':1.0}),
      ('compression_breakout',{'session':'rth','lb':20,'cp':.75,'rv':1.6,'flow':.56,'atrmax':.90,'range':1.1}),
      ('ema20_reclaim',{'session':'open2h','cp':.65,'rv':1.0,'flow':.52,'tol':.25}),
      ('ema20_reclaim',{'session':'rth','cp':.70,'rv':1.2,'flow':.54,'tol':.20}),
    ]


def signal_mask(x,strategy,p,direction):
    trend_up=(x.close>x.ema50)&(x.ema20>x.ema50)&(x.ema50s>0)
    trend_dn=(x.close<x.ema50)&(x.ema20<x.ema50)&(x.ema50s<0)
    cp=x.closepos; flow=x.buy_flow5
    if strategy=='sweep_flow':
        lo=x['ll'+str(p['lb'])]; hi=x['hh'+str(p['lb'])]
        if direction==1:
            swept=(lo-x.low)>=p['sweep']*x.atr
            z=swept&(x.close>lo)&(cp>=p['cp'])&(x.rvol>=p['rv'])&(flow>=p['flow'])&(x.lowerwick>=.10)
            if p['trend']=='ema': z&=trend_up
            if p['vwap']=='above': z&=(x.close>x.vwap)
            elif p['vwap']=='near': z&=(x.close>=x.vwap-.30*x.atr)
        else:
            swept=(x.high-hi)>=p['sweep']*x.atr
            z=swept&(x.close<hi)&(cp<=1-p['cp'])&(x.rvol>=p['rv'])&(flow<=1-p['flow'])&(x.upperwick>=.10)
            if p['trend']=='ema': z&=trend_dn
            if p['vwap']=='above': z&=(x.close<x.vwap)
            elif p['vwap']=='near': z&=(x.close<=x.vwap+.30*x.atr)
    elif strategy=='vwap_reclaim':
        if direction==1:
            cross=(x.prev_close<=x.vwap.shift(1))&(x.close>x.vwap)
            z=cross&(cp>=p['cp'])&(x.rvol>=p['rv'])&(flow>=p['flow'])
            if p['trend']=='ema': z&=trend_up
        else:
            cross=(x.prev_close>=x.vwap.shift(1))&(x.close<x.vwap)
            z=cross&(cp<=1-p['cp'])&(x.rvol>=p['rv'])&(flow<=1-p['flow'])
            if p['trend']=='ema': z&=trend_dn
    elif strategy=='orb15_flow':
        if direction==1:
            cross=(x.prev_close<=x.or15_hi)&(x.close>x.or15_hi)
            z=cross&(cp>=p['cp'])&(x.rvol>=p['rv'])&(flow>=p['flow'])&trend_up
        else:
            cross=(x.prev_close>=x.or15_lo)&(x.close<x.or15_lo)
            z=cross&(cp<=1-p['cp'])&(x.rvol>=p['rv'])&(flow<=1-p['flow'])&trend_dn
    elif strategy=='compression_breakout':
        prev_compressed=x.atr_regime.shift(1)<=p['atrmax']
        if direction==1:
            z=(x.close>x.hh20)&prev_compressed&(cp>=p['cp'])&(x.rvol>=p['rv'])&(flow>=p['flow'])&(x.range_atr>=p['range'])&trend_up
        else:
            z=(x.close<x.ll20)&prev_compressed&(cp<=1-p['cp'])&(x.rvol>=p['rv'])&(flow<=1-p['flow'])&(x.range_atr>=p['range'])&trend_dn
    elif strategy=='ema20_reclaim':
        near=(x.close-x.ema20).abs()<=p['tol']*x.atr
        if direction==1:
            z=trend_up&near&(x.low<=x.ema20)&(x.close>x.ema20)&(cp>=p['cp'])&(x.rvol>=p['rv'])&(flow>=p['flow'])&(x.close>=x.vwap-.25*x.atr)
        else:
            z=trend_dn&near&(x.high>=x.ema20)&(x.close<x.ema20)&(cp<=1-p['cp'])&(x.rvol>=p['rv'])&(flow<=1-p['flow'])&(x.close<=x.vwap+.25*x.atr)
    else: raise ValueError(strategy)
    z=z&session(x,p['session'])
    return (z&~z.shift(1,fill_value=False)).fillna(False).to_numpy()


def sim(x,signals,region,direction,stop_atr,horizon):
    O=x.open.to_numpy(float); H=x.high.to_numpy(float); L=x.low.to_numpy(float); C=x.close.to_numpy(float); A=x.atr.to_numpy(float); T=x.open_time.to_numpy()
    idx=np.flatnonzero(signals&region); out=[]; blocked=-1; n=len(x)
    for i in idx:
        if i<=blocked or i+1>=n or not region[i+1] or not np.isfinite(A[i]) or A[i]<=0: continue
        e=i+1; entry=O[e]; risk=stop_atr*A[i]; stop_pct=risk/entry
        if stop_pct<=COST_FRAC*1.5: continue
        stop=entry-direction*risk; target=entry+direction*TARGET_R*risk
        last=min(e+horizon-1,n-1); gross=None; outcome='timeout'; ex=last
        for j in range(e,last+1):
            if not region[j]: last=j-1; break
            hs=(L[j]<=stop) if direction==1 else (H[j]>=stop)
            ht=(H[j]>=target) if direction==1 else (L[j]<=target)
            if hs and ht: gross=-1.; outcome='stop_amb'; ex=j; break
            if hs: gross=-1.; outcome='stop'; ex=j; break
            if ht: gross=3.; outcome='target'; ex=j; break
        if gross is None:
            ex=max(e,last); gross=direction*(C[ex]-entry)/risk
        net=gross-(COST_FRAC/stop_pct)
        out.append({'net_r':float(net),'gross_r':float(gross),'outcome':outcome,'stop_pct':float(stop_pct),'entry_time':pd.Timestamp(T[e]),'exit_time':pd.Timestamp(T[ex])})
        blocked=ex
    return out


def metrics(tr):
    if not tr: return {'n':0,'ev':-999.}
    r=np.array([a['net_r'] for a in tr]); target=np.array([a['outcome']=='target' for a in tr])
    pos=r[r>0].sum(); neg=-r[r<0].sum(); eq=np.cumsum(r); peak=np.maximum.accumulate(np.r_[0,eq]); dd=(np.r_[0,eq]-peak).min()
    streak=cur=0
    for q in r<0: cur=cur+1 if q else 0; streak=max(streak,cur)
    n=len(r); ph=target.mean(); z=1.96; den=1+z*z/n; wlb=(ph+z*z/(2*n)-z*math.sqrt((ph*(1-ph)+z*z/(4*n))/n))/den
    return {'n':n,'target_rate':float(ph),'wilson_lb':float(wlb),'ev':float(r.mean()),'sum_r':float(r.sum()),'pf':float(pos/neg) if neg>0 else 99.,'maxdd_r':float(-dd),'loss_streak':int(streak),'avg_stop_pct':float(np.mean([a['stop_pct'] for a in tr]))}


def bootstrap(tr,reps=5000,seed=11):
    r=np.array([a['net_r'] for a in tr]);
    if len(r)<2: return (np.nan,np.nan)
    rng=np.random.default_rng(seed); means=np.array([rng.choice(r,len(r),replace=True).mean() for _ in range(reps)])
    return tuple(np.quantile(means,[.025,.975]))


def equity_curve(tr,risk_frac=.03):
    if not tr: return (1000.,0.)
    tr=sorted(tr,key=lambda a:a['entry_time']); eq=1000.; peak=eq; maxdd=0.
    for a in tr:
        eq*=max(0.01,1+risk_frac*a['net_r']); peak=max(peak,eq); maxdd=max(maxdd,(peak-eq)/peak)
    return float(eq),float(maxdd)


def folds(x,symbol):
    # Non-overlapping forward test blocks. Rules are fixed; only stop/holding settings are tuned on preceding data.
    rth=(x.nywd<5)&(x.minute>=570)&(x.minute<960)
    days=pd.Index(pd.Series(x.loc[rth,'session_day']).drop_duplicates().tolist())
    train_n,test_n=(40,10) if symbol=='PLTRUSDT' else (15,5)
    out=[]; start=train_n
    while start+test_n<=len(days):
        train_days=set(days[start-train_n:start]); test_days=set(days[start:start+test_n])
        tr=x.session_day.isin(train_days).to_numpy(); te=x.session_day.isin(test_days).to_numpy()
        out.append((tr,te,str(days[start]),str(days[start+test_n-1])))
        start+=test_n
    return out


def run_config(x,symbol,tf,strategy,p,direction):
    sg=signal_mask(x,strategy,p,direction); all_test=[]; frows=[]
    stop_grid=[.8,1.0,1.2,1.5]; horizon_grid=([30,60,90] if tf=='1m' else [6,12,18])
    for fi,(trmask,temask,t0,t1) in enumerate(folds(x,symbol),1):
        choices=[]
        for sa in stop_grid:
            for h in horizon_grid:
                tr=sim(x,sg,trmask,direction,sa,h); m=metrics(tr)
                if m['n']<6: continue
                # The deployment gate is part of the algorithm: do not trade a regime that had no positive training edge.
                score=m['ev']*math.sqrt(m['n']) + .06*math.log(max(.2,min(m['pf'],5))) - .02*m['maxdd_r']
                choices.append((score,sa,h,m))
        if not choices:
            frows.append({'fold':fi,'start':t0,'end':t1,'active':False,'reason':'insufficient_train'}); continue
        choices.sort(key=lambda q:q[0],reverse=True); score,sa,h,tm=choices[0]
        if tm['ev']<=.05 or tm['pf']<=1.02:
            frows.append({'fold':fi,'start':t0,'end':t1,'active':False,'reason':'train_gate','train_ev':tm['ev']}); continue
        te=sim(x,sg,temask,direction,sa,h); em=metrics(te)
        all_test.extend(te)
        frows.append({'fold':fi,'start':t0,'end':t1,'active':True,'stop_atr':sa,'horizon':h,'train_ev':tm['ev'],'train_n':tm['n'],'test_ev':em.get('ev',-999),'test_n':em.get('n',0)})
    m=metrics(all_test); lo,hi=bootstrap(all_test); eq,mdd=equity_curve(all_test)
    active=[r for r in frows if r.get('active')]; positive=[r for r in active if r.get('test_n',0)>0 and r.get('test_ev',-999)>0]
    fold_evs=[r['test_ev'] for r in active if r.get('test_n',0)>0]
    rec={'symbol':symbol,'tf':tf,'strategy':strategy,'params':json.dumps(p,sort_keys=True),'direction':'long' if direction==1 else 'short',
         **{'oos_'+k:v for k,v in m.items()},'oos_ci_lo':lo,'oos_ci_hi':hi,'folds_total':len(frows),'folds_active':len(active),
         'folds_positive':len(positive),'positive_fold_ratio':len(positive)/len(active) if active else 0.,
         'median_fold_ev':float(np.median(fold_evs)) if fold_evs else np.nan,'worst_fold_ev':float(np.min(fold_evs)) if fold_evs else np.nan,
         'equity_3pct':eq,'equity_maxdd_pct':mdd}
    n=m.get('n',0); ev=m.get('ev',-999); rec['credible'] = bool(n>=25 and len(active)>=3 and rec['positive_fold_ratio']>=.60 and ev>0 and np.isfinite(lo) and lo>0)
    rec['robust_score'] = (ev*math.sqrt(max(n,1)) + .35*(lo if np.isfinite(lo) else -2) + .20*(rec['median_fold_ev'] if np.isfinite(rec['median_fold_ev']) else -2) - .50*mdd)
    return rec,frows,all_test


def main():
    rows=[]; fold_rows=[]
    for symbol,start in STARTS.items():
        raw=load(symbol,start,END)
        for tf in ['1m','5m']:
            print('ROUND2',symbol,tf); x=features(raw if tf=='1m' else resample5(raw))
            for strategy,p in configs():
                for direction in [1,-1]:
                    rec,fr,tr=run_config(x,symbol,tf,strategy,p,direction)
                    rows.append(rec)
                    for q in fr: fold_rows.append({'symbol':symbol,'tf':tf,'strategy':strategy,'params':json.dumps(p,sort_keys=True),'direction':'long' if direction==1 else 'short',**q})
    df=pd.DataFrame(rows).sort_values(['credible','robust_score','oos_ev'],ascending=False)
    df.to_csv(OUT/'ROUND2_TOURNAMENT.csv',index=False); pd.DataFrame(fold_rows).to_csv(OUT/'ROUND2_FOLDS.csv',index=False)
    print('\n=== ROUND 2 WALK-FORWARD 3R TOURNAMENT ===')
    cols=['symbol','tf','strategy','direction','params','oos_n','oos_target_rate','oos_wilson_lb','oos_ev','oos_ci_lo','oos_ci_hi','oos_pf','oos_maxdd_r','oos_loss_streak','folds_active','positive_fold_ratio','median_fold_ev','equity_3pct','equity_maxdd_pct','credible','robust_score']
    print(df[cols].head(20).to_string(index=False))
    summary={'data_end_requested':str(END),'cost_frac':COST_FRAC,'target_r':TARGET_R,'top':df.head(20).to_dict(orient='records')}
    (OUT/'summary_round2.json').write_text(json.dumps(summary,indent=2,default=str))

if __name__=='__main__': main()
