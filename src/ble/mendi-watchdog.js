export class MendiWatchdog {
  constructor(options = {}) {
    this.timeoutMs = options.timeoutMs ?? 5000;
    this.checkIntervalMs = options.checkIntervalMs ?? 1000;
    this.lastPacketAt = null;
    this.state = "idle";
    this.timer = null;
    this.listeners = new Set();
  }

  start() {
    this.state = "monitoring";

    this.timer = setInterval(() => {
      this.check();
    }, this.checkIntervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.state = "stopped";
  }

  recordPacket(timestamp = Date.now()) {
    this.lastPacketAt = timestamp;
    this.setState("healthy");
  }

  check() {
    if (!this.lastPacketAt) {
      return;
    }

    const elapsed = Date.now() - this.lastPacketAt;

    if (elapsed > this.timeoutMs) {
      this.setState("stale");
    }
  }

  setState(state) {
    if (this.state === state) {
      return;
    }

    this.state = state;

    for (const listener of this.listeners) {
      listener(state);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getState() {
    return {
      state: this.state,
      lastPacketAt: this.lastPacketAt
    };
  }
}
