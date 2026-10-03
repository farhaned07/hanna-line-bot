/**
 * One Brain Cardio prototype rules.
 * DEMO ONLY — not a medical device, diagnosis, or decompensation predictor.
 *
 * Keep cardio-specific thresholds out of OneBrain.js so they can be
 * reviewed, versioned, tested, and replaced independently.
 */

const CARDIO_RULES_VERSION = 'prototype-v1';

const DEFAULTS = Object.freeze({
  weightGainKg48h: 1.5,
  activityDropPct: 35,
  voiceConcernThreshold: 0.65,
  scgDriftThreshold: 0.28,
  reviewScoreThreshold: 3,
});

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Evaluate longitudinal cardio signals.
 * Returns reasons + review recommendation only.
 * It never returns a diagnosis.
 */
function evaluateCardioSignals(input, rules = DEFAULTS) {
  const {
    weightGainKg48h = 0,
    activityDropPct = 0,
    voiceConcern = 0,
    scgDrift = 0,
    missedCheckins = 0,
  } = input || {};

  let score = 0;
  const reasons = [];

  if (weightGainKg48h >= rules.weightGainKg48h) {
    score += 2;
    reasons.push(`Weight drift +${weightGainKg48h.toFixed(1)} kg / 48h`);
  }

  if (activityDropPct >= rules.activityDropPct) {
    score += 1;
    reasons.push(`Activity down ${Math.round(activityDropPct)}%`);
  }

  if (voiceConcern >= rules.voiceConcernThreshold) {
    score += 1;
    reasons.push('Voice/symptom trend changed');
  }

  if (scgDrift >= rules.scgDriftThreshold) {
    score += 2;
    reasons.push('SCG signal drift detected');
  }

  if (missedCheckins >= 2) {
    score += 1;
    reasons.push(`${missedCheckins} missed check-ins`);
  }

  score = clamp(score, 0, 10);

  return {
    version: CARDIO_RULES_VERSION,
    score,
    reasons,
    nurseReviewRecommended: score >= rules.reviewScoreThreshold,
    output: score >= rules.reviewScoreThreshold
      ? 'Signal drift detected. Nurse review recommended.'
      : 'No nurse review trigger from current prototype rules.',
    disclaimer: 'Prototype decision-support signal only. No diagnosis is produced.',
  };
}

module.exports = {
  CARDIO_RULES_VERSION,
  DEFAULTS,
  evaluateCardioSignals,
};
