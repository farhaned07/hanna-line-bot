#!/usr/bin/env python3
import numpy as np
import quant_tournament_round2 as q


def bootstrap_fast(tr,reps=2500,seed=11):
    r=np.array([a['net_r'] for a in tr],dtype=float)
    if len(r)<2:
        return (np.nan,np.nan)
    rng=np.random.default_rng(seed)
    # Vectorized bootstrap: same statistic, far less Python overhead.
    means=rng.choice(r,size=(reps,len(r)),replace=True).mean(axis=1)
    return tuple(np.quantile(means,[.025,.975]))

q.bootstrap=bootstrap_fast
q.main()
