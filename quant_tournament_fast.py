#!/usr/bin/env python3
import io, zipfile, json, math
from pathlib import Path
import numpy as np, pandas as pd, requests

BASE='https://data.binance.vision/data/futures/um'
COLS=['open_time','open','high','low','close','volume','close_time','quote_volume','count','taker_buy_volume','taker_buy_quote_volume','ignore']
START={'PLTRUSDT':'2026-02-09','SPCXUSDT':'2026-06-15'}
END=pd.Timestamp('2026-08-11 23:59:59',tz='UTC')
COST=.0014; TARGET_R=3.; OUT=Path('quant_results_fast'); OUT.mkdir(exist_ok=True)

def zcsv(url):
    r=requests.get(url,timeout=30)
    if r.status_code==404:return None
    r.raise_for_status()
    with zipfile.ZipFile(io.BytesIO(r.content)) as z:
        f=[n for n in z.namelist() if n.endswith('.csv')][0]; b=z.read(f)
    d=pd.read_csv(io.BytesIO(b),header=None)
    if str(d.iloc[0,0]).lower() in ('open_time','open time'): d=d.iloc[1:]
    d=d.iloc[:,:12];d.columns=COLS;return d

def clean(d):
    d=d.copy(); t=pd.to_numeric(d.open_time,errors='coerce'); unit='us' if t.dropna().median()>1e14 else 'ms'; d['open_time']=pd.to_datetime(t,unit=unit,utc=True)
    for c in ['open','high','low','close','volume','quote_volume','taker_buy_volume','taker_buy_quote_volume']:d[c]=pd.to_numeric(d[c],errors='coerce')
    return d.dropna(subset=['open_time','open','high','low','close','volume'])[['open_time','open','high','low','close','volume','quote_volume','taker_buy_volume','taker_buy_quote_volume']]

def load(sym):
    st=pd.Timestamp(START[sym],tz='UTC'); parts=[]; covered=set(); cur=pd.Timestamp(st.year,st.month,1,tz='UTC'); last=pd.Timestamp(END.year,END.month,1,tz='UTC')
    while cur<=last:
        ym=cur.strftime('%Y-%m'); d=zcsv(f'{BASE}/monthly/klines/{sym}/1m/{sym}-1m-{ym}.zip')
        if d is not None:
            x=clean(d);parts.append(x);covered.update(x.open_time.dt.strftime('%Y-%m-%d'));print(sym,ym,len(x),flush=True)
        cur+=pd.offsets.MonthBegin(1)
    day=st.floor('D')
    while day<=END.floor('D'):
        ds=day.strftime('%Y-%m-%d')
        if ds not in covered:
            d=zcsv(f'{BASE}/daily/klines/{sym}/1m/{sym}-1m-{ds}.zip')
            if d is not None:parts.append(clean(d))
        day+=pd.Timedelta(days=1)
    x=pd.concat(parts).drop_duplicates('open_time').sort_values('open_time');x=x[(x.open_time>=st)&(x.open_time<=END)].reset_index(drop=True)
    print('LOADED',sym,len(x),x.open_time.min(),x.open_time.max(),flush=True);return x

def rs5(d):
    return d.set_index('open_time').resample('5min',label='left',closed='left').agg(open=('open','first'),high=('high','max'),low=('low','min'),close=('close','last'),volume=('volume','sum'),quote_volume=('quote_volume','sum'),taker_buy_volume=('taker_buy_volume','sum'),taker_buy_quote_volume=('taker_buy_quote_volume','sum')).dropna().reset_index()

def features(d):
    x=d.copy();c=x.close;h=x.high;l=x.low;v=x.volume
    x['e20']=c.ewm(span=20,adjust=False).mean();x['e50']=c.ewm(span=50,adjust=False).mean();x['e50s']=x.e50.pct_change(10)
    pc=c.shift();tr=pd.concat([h-l,(h-pc).abs(),(l-pc).abs()],axis=1).max(axis=1);x['atr']=tr.ewm(alpha=1/14,adjust=False).mean()
    de=c.diff();g=de.clip(lower=0).ewm(alpha=1/14,adjust=False).mean();ls=(-de.clip(upper=0)).ewm(alpha=1/14,adjust=False).mean();x['rsi']=100-100/(1+g/ls.replace(0,np.nan))
    ny=x.open_time.dt.tz_convert('America/New_York');day=ny.dt.date;tp=(h+l+c)/3;x['vwap']=(tp*v).groupby(day).cumsum()/v.groupby(day).cumsum().replace(0,np.nan)
    x['rv']=v/v.rolling(20).median().replace(0,np.nan);x['hh20']=h.shift().rolling(20).max();x['ll20']=l.shift().rolling(20).min();x['hh10']=h.shift().rolling(10).max();x['ll10']=l.shift().rolling(10).min();x['cp']=(c-l)/(h-l).replace(0,np.nan)
    x['wd']=ny.dt.weekday;x['min']=ny.dt.hour*60+ny.dt.minute;return x

def session(x,s):
    wd=x.wd<5;m=x['min']
    return {'rth':wd&(m>=570)&(m<960),'open2h':wd&(m>=570)&(m<690),'close2h':wd&(m>=840)&(m<960),'all_weekday':wd}[s]

def signal(x,name,s,di):
    up=(x.close>x.e50)&(x.e20>x.e50)&(x.e50s>0);dn=(x.close<x.e50)&(x.e20<x.e50)&(x.e50s<0)
    if name=='vwap_pullback':
        near=(x.close-x.vwap).abs()<=.35*x.atr
        z=(up&near&(x.low<=x.vwap)&(x.close>x.vwap)&x.rsi.between(48,65)&(x.close>x.open)) if di==1 else (dn&near&(x.high>=x.vwap)&(x.close<x.vwap)&x.rsi.between(35,52)&(x.close<x.open))
    elif name=='ema_pullback':
        near=(x.close-x.e20).abs()<=.35*x.atr
        z=(up&near&(x.low<=x.e20)&(x.close>x.e20)&(x.rv>=1.3)) if di==1 else (dn&near&(x.high>=x.e20)&(x.close<x.e20)&(x.rv>=1.3))
    elif name=='breakout':
        z=(up&(x.close>x.hh20)&(x.rv>=1.5)&(x.cp>=.7)) if di==1 else (dn&(x.close<x.ll20)&(x.rv>=1.5)&(x.cp<=.3))
    elif name=='sweep_reclaim':
        z=((x.low<x.ll10)&(x.close>x.ll10)&(x.cp>=.7)&(x.rv>=1.4)&(x.close>x.e50)) if di==1 else ((x.high>x.hh10)&(x.close<x.hh10)&(x.cp<=.3)&(x.rv>=1.4)&(x.close<x.e50))
    else:
        st=(x.close-x.vwap)/x.atr.replace(0,np.nan);flat=x.e50s.abs()<=.004
        z=(flat&(st<=-1.5)&(x.rsi<=30)&(x.cp>=.55)) if di==1 else (flat&(st>=1.5)&(x.rsi>=70)&(x.cp<=.45))
    z=z&session(x,s);return (z&~z.shift(1,fill_value=False)).fillna(False).to_numpy()

def regions(x):
    ds=pd.Index(x.open_time.dt.floor('D').unique()).sort_values();n=len(ds);a=ds[int(n*.6)-1];b=ds[int(n*.8)-1];d=x.open_time.dt.floor('D')
    return {'train':(d<=a).to_numpy(),'val':((d>a)&(d<=b)).to_numpy(),'test':(d>b).to_numpy()},a,b

def simulate(x,sg,rg,di,sa,horizon):
    O=x.open.to_numpy(float);H=x.high.to_numpy(float);L=x.low.to_numpy(float);C=x.close.to_numpy(float);A=x.atr.to_numpy(float);ids=np.flatnonzero(sg&rg);tr=[];block=-1;n=len(x)
    for i in ids:
        if i<=block or i+1>=n or not rg[i+1] or not np.isfinite(A[i]) or A[i]<=0:continue
        e=i+1;en=O[e];risk=sa*A[i];sp=risk/en
        if sp<=COST*1.25:continue
        st=en-di*risk;tg=en+di*3*risk;last=min(e+horizon-1,n-1);gross=None;out='timeout';ex=last
        for j in range(e,last+1):
            if not rg[j]:last=j-1;break
            hs=L[j]<=st if di==1 else H[j]>=st;ht=H[j]>=tg if di==1 else L[j]<=tg
            if hs: gross=-1.;out='stop';ex=j;break
            if ht: gross=3.;out='target';ex=j;break
        if gross is None:ex=max(e,last);gross=di*(C[ex]-en)/risk
        tr.append((gross-COST/sp,out,sp));block=ex
    return tr

def metrics(tr):
    if not tr:return {'n':0,'ev':-999,'target_rate':0,'wilson':0,'pf':0,'maxdd_r':999,'loss_streak':999,'avg_stop_pct':0}
    r=np.array([q[0] for q in tr]);w=np.array([q[1]=='target' for q in tr]);n=len(r);ph=w.mean();z=1.96;den=1+z*z/n;wl=(ph+z*z/(2*n)-z*np.sqrt((ph*(1-ph)+z*z/(4*n))/n))/den
    pos=r[r>0].sum();neg=-r[r<0].sum();eq=np.cumsum(r);dd=np.r_[0,eq]-np.maximum.accumulate(np.r_[0,eq]);best=cur=0
    for q in r<0:cur=cur+1 if q else 0;best=max(best,cur)
    return {'n':n,'ev':r.mean(),'target_rate':ph,'wilson':wl,'pf':pos/neg if neg else 99.,'maxdd_r':-dd.min(),'loss_streak':best,'avg_stop_pct':np.mean([q[2] for q in tr])}

def boot(tr):
    r=np.array([q[0] for q in tr]);
    if len(r)<2:return np.nan,np.nan
    rng=np.random.default_rng(17);m=np.array([rng.choice(r,len(r),replace=True).mean() for _ in range(3000)]);return np.quantile(m,[.025,.975])

def run(raw,sym,tf):
    x=features(raw if tf=='1m' else rs5(raw));rg,a,b=regions(x);h=60 if tf=='1m' else 12;rows=[]
    for name in ['vwap_pullback','ema_pullback','breakout','sweep_reclaim','vwap_mean_revert']:
      for s in ['rth','open2h','close2h','all_weekday']:
       for di in [1,-1]:
        sg=signal(x,name,s,di)
        for sa in [.6,.8,1.0,1.2]:
            tr=simulate(x,sg,rg['train'],di,sa,h);m=metrics(tr)
            if m['n']>=20:rows.append({'strategy':name,'session':s,'direction':'long' if di==1 else 'short','stop_atr':sa,'train_score':m['ev']*np.sqrt(m['n'])-.02*m['maxdd_r'],**{'train_'+k:v for k,v in m.items()}})
    if not rows:return []
    td=pd.DataFrame(rows).sort_values('train_score',ascending=False).head(20);vv=[]
    for _,r in td.iterrows():
        di=1 if r.direction=='long' else -1;sg=signal(x,r.strategy,r.session,di);m=metrics(simulate(x,sg,rg['val'],di,r.stop_atr,h));q=r.to_dict();q.update({'val_'+k:v for k,v in m.items()});vv.append(q)
    vd=pd.DataFrame(vv);el=vd[(vd.val_n>=6)&(vd.val_ev>0)].copy()
    if el.empty:el=vd.copy()
    el['score']=el.val_ev*np.sqrt(el.val_n.clip(lower=1))+.25*el.val_wilson
    fin=el.sort_values('score',ascending=False).head(3);out=[]
    for _,r in fin.iterrows():
        di=1 if r.direction=='long' else -1;sg=signal(x,r.strategy,r.session,di);tr=simulate(x,sg,rg['test'],di,r.stop_atr,h);m=metrics(tr);lo,hi=boot(tr);q=r.to_dict();q.update({'symbol':sym,'tf':tf,'train_end':str(a),'val_end':str(b),**{'test_'+k:v for k,v in m.items()},'test_ci_lo':lo,'test_ci_hi':hi})
        eq=1000.;peak=1000.;md=0
        for rr,_,_ in tr:eq*=max(.01,1+.03*rr);peak=max(peak,eq);md=max(md,1-eq/peak)
        q['equity_3pct']=eq;q['equity_dd']=md;out.append(q)
    return out

def main():
    out=[]
    for sym in ['PLTRUSDT','SPCXUSDT']:
        raw=load(sym)
        for tf in ['1m','5m']:
            print('TOURNAMENT',sym,tf,flush=True);out+=run(raw,sym,tf)
    d=pd.DataFrame(out);d['credible']=(d.test_n>=20)&(d.test_ev>0)&(d.test_ci_lo>=0);d=d.sort_values(['credible','test_ci_lo','test_ev','test_n'],ascending=[False,False,False,False]);d.to_csv(OUT/'FINAL_TOURNAMENT_FAST.csv',index=False)
    cols=['symbol','tf','strategy','session','direction','stop_atr','test_n','test_target_rate','test_wilson','test_ev','test_ci_lo','test_ci_hi','test_pf','test_maxdd_r','test_loss_streak','test_avg_stop_pct','equity_3pct','equity_dd','credible'];print('\n=== FINAL FAST 3R TOURNAMENT ===');print(d[cols].to_string(index=False),flush=True)
    json.dump(d[cols].to_dict('records'),open(OUT/'summary_fast.json','w'),indent=2,default=float)
if __name__=='__main__':main()
