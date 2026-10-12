const number = value => typeof value === 'number' && Number.isFinite(value);
const axes = ['accX', 'accY', 'accZ', 'gyroX', 'gyroY', 'gyroZ'];

export class StreamHealth {
  constructor() { this.reset(); }

  reset() {
    this.arrivals = [];
    this.lastAt = null;
    this.lastChangeAt = null;
    this.signature = null;
    this.previousImu = null;
    this.consecutiveRepeats = 0;
    this.accelerationDelta = null;
    this.gyroDelta = null;
  }

  observe(optical, imu = {}, nowMs) {
    const values = ['left', 'right'].flatMap(side =>
      ['red', 'infrared', 'ambient'].map(key => optical?.[side]?.[key] ?? null));
    if (!number(nowMs) || !values.some(number)) return null;
    const vector = axes.map(key => number(imu?.[key]) ? imu[key] : null);
    const signature = JSON.stringify([...values, ...vector]);
    const repeated = signature === this.signature;
    this.consecutiveRepeats = repeated ? this.consecutiveRepeats + 1 : 0;
    if (!repeated) this.lastChangeAt = nowMs;
    const delta = indices => indices.every(i => number(vector[i]) && number(this.previousImu?.[i]))
      ? Math.hypot(...indices.map(i => vector[i] - this.previousImu[i])) : null;
    this.accelerationDelta = delta([0, 1, 2]);
    this.gyroDelta = delta([3, 4, 5]);
    this.previousImu = vector;
    this.signature = signature;
    this.lastAt = nowMs;
    this.arrivals.push(nowMs);
    this.prune(nowMs);
    return repeated;
  }

  prune(nowMs) {
    this.arrivals = this.arrivals.filter(t => t >= nowMs - 5000).slice(-20000);
  }

  snapshot(nowMs) {
    this.prune(nowMs);
    const dataAgeMs = this.lastAt === null ? null : Math.max(0, nowMs - this.lastAt);
    const elapsed = this.arrivals.at(-1) - this.arrivals[0];
    const arrivalRateHz = elapsed > 0 ? (this.arrivals.length - 1) * 1000 / elapsed : 0;
    const status = dataAgeMs === null ? 'WAITING' : dataAgeMs >= 2000 ? 'STALE'
      : this.consecutiveRepeats >= 3 ? 'REPEATED VALUES' : 'RECEIVING';
    return {status, dataAgeMs, arrivalRateHz,
      changeAgeMs: this.lastChangeAt === null ? null : Math.max(0, nowMs - this.lastChangeAt),
      consecutiveRepeats: this.consecutiveRepeats,
      accelerationDelta: this.accelerationDelta, gyroDelta: this.gyroDelta};
  }
}
