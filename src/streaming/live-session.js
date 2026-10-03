import { StreamHealth } from './stream-health.js';
const numeric = value => typeof value === 'number' && Number.isFinite(value) ? value : null;

export class LiveSession {
  constructor({bridge}) {
    this.bridge = bridge;
    this.health = new StreamHealth();
    this.session = null;
    this.sequence = 0;
    this.markerCursor = 0;
  }

  begin(session) {
    this.session = session;
    this.sequence = 0; this.markerCursor = 0;
    this.health.reset();
    this.bridge.begin(crypto.randomUUID());
  }

  observe(optical, imu, receiptMs, transport) {
    if (this.session?.status !== 'recording') return;
    const repeat = this.health.observe(optical, imu, receiptMs);
    if (repeat === null) return;
    this.sequence += 1;
    const channels = ['left', 'right'].flatMap(side =>
      ['red', 'infrared'].map(key => numeric(optical?.[side]?.[key])));
    this.bridge.send({type: 'sample', sequence: this.sequence, timestamp_ms: receiptMs,
      optical: channels,
      imu: ['accX', 'accY', 'accZ', 'gyroX', 'gyroY', 'gyroZ'].map(key => numeric(imu?.[key])),
      repeated: repeat, poll: transport === 'poll'});
  }

  flushMarkers() {
    if (!this.session) return;
    const markers = this.session.markers.events;
    while (this.markerCursor < markers.length) {
      const event = markers[this.markerCursor];
      const sent = this.bridge.send({type: 'event', sequence: this.markerCursor + 1,
        timestamp_ms: this.session.clock.performanceStartMs + event.onset * 1000, event});
      if (!sent) break;
      this.markerCursor += 1;
    }
  }

  end() { this.flushMarkers(); this.bridge.end(); }
}
