export class MarkerStore {
  constructor() {
    this.events = [];
  }

  add({ onset, duration = 0, description, source = "manual" }) {
    const marker = {
      onset,
      duration,
      description,
      source
    };
    this.events.push(marker);
    return marker;
  }

  all() {
    return structuredClone(this.events);
  }
}
