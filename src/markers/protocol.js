export class ProtocolMarker {
  constructor(addMarker) {
    this.addMarker = addMarker;
    this.timer = null;
    this.remaining = 0;
  }

  startFixedCycles({ cycles, intervalSeconds, label = "AUTO_PROTOCOL" }) {
    this.stop();
    this.remaining = Math.max(0, Number(cycles) || 0);
    if (!this.remaining || intervalSeconds <= 0) return;

    this.timer = setInterval(() => {
      if (!this.remaining) return this.stop();
      this.addMarker(label, "auto_protocol");
      this.remaining -= 1;
      if (!this.remaining) this.stop();
    }, intervalSeconds * 1000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.remaining = 0;
  }
}
