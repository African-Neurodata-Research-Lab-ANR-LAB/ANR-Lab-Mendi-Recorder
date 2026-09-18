export class StreamQualityEngine {
  constructor(options = {}) {
    this.windowSize = options.windowSize ?? 100;
    this.frames = [];
    this.lastTimestamp = null;
    this.intervals = [];
    this.status = "IDLE";
  }

  process(frameReport, timestamp = Date.now()) {
    this.frames.push(frameReport);

    if (this.frames.length > this.windowSize) {
      this.frames.shift();
    }

    if (this.lastTimestamp !== null) {
      this.intervals.push(timestamp - this.lastTimestamp);
      if (this.intervals.length > this.windowSize) {
        this.intervals.shift();
      }
    }

    this.lastTimestamp = timestamp;

    return this.getReport();
  }

  getFrameRate() {
    if (this.intervals.length === 0) return 0;

    const averageInterval =
      this.intervals.reduce((sum, value) => sum + value, 0) /
      this.intervals.length;

    return averageInterval > 0 ? 1000 / averageInterval : 0;
  }

  getReport() {
    const total = this.frames.length;

    const duplicates = this.frames.filter(
      (frame) => frame.duplicate
    ).length;

    const freshness = total === 0
      ? 0
      : ((total - duplicates) / total) * 100;

    if (freshness >= 95) {
      this.status = "GOOD";
    } else if (freshness >= 80) {
      this.status = "WARNING";
    } else {
      this.status = "STALE";
    }

    return {
      status: this.status,
      framesAnalyzed: total,
      freshness,
      duplicateRate: total === 0 ? 0 : (duplicates / total) * 100,
      frameRate: this.getFrameRate()
    };
  }

  reset() {
    this.frames = [];
    this.intervals = [];
    this.lastTimestamp = null;
    this.status = "IDLE";
  }
}
