export class IntervalMarker {
  constructor(addMarker, intervalSeconds) {
    this.addMarker = addMarker;
    this.intervalSeconds = intervalSeconds;
    this.timer = null;
  }

  start() {
    if (!Number.isFinite(this.intervalSeconds) || this.intervalSeconds <= 0) return;
    this.timer = setInterval(
      () => this.addMarker("AUTO_INTERVAL", "auto_interval"),
      this.intervalSeconds * 1000
    );
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
