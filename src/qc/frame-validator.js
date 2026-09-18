export class FrameValidator {
  constructor(options = {}) {
    this.maxHistory = options.maxHistory ?? 100;
    this.history = [];
    this.totalFrames = 0;
    this.duplicateFrames = 0;
  }

  fingerprint(frame) {
    const bytes = frame instanceof Uint8Array ? frame : new Uint8Array(frame);
    let hash = 2166136261;

    for (const byte of bytes) {
      hash ^= byte;
      hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16);
  }

  validate(frame) {
    const hash = this.fingerprint(frame);
    const duplicate = this.history.includes(hash);

    this.totalFrames += 1;

    if (duplicate) {
      this.duplicateFrames += 1;
    }

    this.history.push(hash);

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    return {
      hash,
      duplicate,
      fresh: !duplicate,
      totalFrames: this.totalFrames,
      duplicateFrames: this.duplicateFrames,
      freshness: this.totalFrames === 0
        ? 0
        : ((this.totalFrames - this.duplicateFrames) / this.totalFrames) * 100
    };
  }

  reset() {
    this.history = [];
    this.totalFrames = 0;
    this.duplicateFrames = 0;
  }
}
