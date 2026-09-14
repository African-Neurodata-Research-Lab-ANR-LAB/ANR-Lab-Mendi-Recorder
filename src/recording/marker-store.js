export class MarkerStore {
  constructor() {
    this.events = [];
  }

  add({
    onset,
    protocolTime = null,
    duration = 0,
    trialType = "",
    markerType = "",
    phase = null,
    cycle = null,
    description,
    source = "manual"
  }) {
    const marker = {
      onset,
      protocolTime,
      duration,
      trialType: trialType || description,
      markerType: markerType || source,
      phase,
      cycle,
      description,
      source
    };

    this.events.push(marker);
    return structuredClone(marker);
  }

  all() {
    return structuredClone(this.events);
  }
}
