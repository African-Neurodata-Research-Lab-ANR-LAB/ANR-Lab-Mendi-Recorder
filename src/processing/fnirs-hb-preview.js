// Optical-density helper only. Haemoglobin output is gated pending validation.

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

export function estimateHbPreview() {
  return {hbo: null, hbr: null, status: "UNVALIDATED",
    reason: "Validated acquisition, wavelength/geometry metadata, and a tested haemoglobin conversion are required."};
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
