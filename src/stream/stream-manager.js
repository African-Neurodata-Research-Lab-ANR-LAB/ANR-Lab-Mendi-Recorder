/**
 * Central acquisition stream bus.
 *
 * Keeps BLE transport separate from downstream consumers:
 * decoder, recorder, visualization and quality monitoring.
 */
export class StreamManager {
  constructor() {
    this.listeners = new Set();

    this.state = {
      status: "idle",
      packetsReceived: 0,
      startedAt: null,
      lastPacketAt: null,
    };
  }

  start() {
    this.state.status = "streaming";
    this.state.startedAt = Date.now();
  }

  stop() {
    this.state.status = "stopped";
  }

  publish(packet) {
    this.state.packetsReceived += 1;
    this.state.lastPacketAt = packet.timestampMs ?? Date.now();

    this.listeners.forEach((listener) => {
      listener(packet);
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getState() {
    return { ...this.state };
  }
}
