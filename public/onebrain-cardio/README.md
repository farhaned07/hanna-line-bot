# One Brain Cardio Prototype

Branch: `prototype/onebrain-cardio`

This prototype demonstrates:
- 30-day simulated heart-failure patient trend
- transparent cardio trigger rules separated from the OneBrain core
- smartphone DeviceMotion capture (accelerometer + gyroscope)
- explicit simulated fallback when browser/device sensors are unavailable
- nurse-review queue
- stage-safe language: **"Signal drift detected. Nurse review recommended."**

## Run

Serve the repository over HTTPS or localhost and open:

`/public/onebrain-cardio/index.html`

DeviceMotion access on iOS requires a user gesture and HTTPS.

## Safety / claims

This is a demo only, not a medical device. It does not diagnose heart failure, predict decompensation, or recommend treatment. The patient and outcome numbers are simulated/illustrative.

The SCG feature is framed as a signal for human review only.
