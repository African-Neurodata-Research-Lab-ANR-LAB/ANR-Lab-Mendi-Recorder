export function createManualMarker(label, clock) {
  return {
    onset: clock.nowSeconds(),
    duration: 0,
    description: label,
    source: "manual"
  };
}
