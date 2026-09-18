// Lightweight fNIRS preview layer.
// Converts raw optical intensity changes into relative HbO/HbR trends.
// This is a preview only: full calibration, MBLL path length factors,
// extinction coefficients and motion correction will be added later.

function safeLog(value) {
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.log(value);
}

export function opticalDensity(current, baseline) {
  if (!Number.isFinite(current) || !Number.isFinite(baseline) || baseline <= 0) {
    return null;
  }

  return safeLog(baseline / current);
}

export function estimateHbPreview({ red, infrared, baseline }) {
  const redOD = opticalDensity(red, baseline?.red);
  const irOD = opticalDensity(infrared, baseline?.infrared);

  if (redOD === null || irOD === null) {
    return {
      hbo: null,
      hbr: null,
      status: "INSUFFICIENT_BASELINE"
    };
  }

  return {
    // Relative preview signals only.
    hbo: irOD - redOD,
    hbr: redOD - irOD,
    status: "PREVIEW"
  };
}

export function createHbPreviewProcessor() {
  let baseline = null;

  return {
    setBaseline(sample) {
      baseline = {
        red: sample.red,
        infrared: sample.infrared
      };
    },

    process(sample) {
      return estimateHbPreview({
        ...sample,
        baseline
      });
    }
  };
}
