export function evaluateStream(samples) {
  if (!samples?.length) {
    return { status: "NO SIGNAL", count: 0 };
  }

  if (samples.length < 3) {
    return { status: "REVIEW", count: samples.length };
  }

  return {
    status: "GOOD",
    count: samples.length
  };
}
