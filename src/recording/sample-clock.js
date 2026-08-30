export class SampleClock {
  start() {
    this.wallStartMs = Date.now();
    this.performanceStartMs =
      globalThis.performance?.now?.() ?? Date.now();
  }

  nowSeconds() {
    const now = globalThis.performance?.now?.() ?? Date.now();
    return (now - this.performanceStartMs) / 1000;
  }

  wallNowMs() {
    return Date.now();
  }
}
