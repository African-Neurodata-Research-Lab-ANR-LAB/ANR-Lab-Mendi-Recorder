export class StreamHealthPanel {
  constructor() {
    this.metrics = {
      connection: "disconnected",
      status: "idle",
      frames: 0,
      freshness: 0,
      duplicateRate: 0,
      frameRate: 0,
      latencyMs: 0
    };
  }

  update({ quality = {}, connection = null } = {}) {
    if (connection) {
      this.metrics.connection = connection;
    }

    this.metrics = {
      ...this.metrics,
      status: quality.status ?? this.metrics.status,
      frames: quality.framesAnalyzed ?? this.metrics.frames,
      freshness: quality.freshness ?? this.metrics.freshness,
      duplicateRate: quality.duplicateRate ?? this.metrics.duplicateRate,
      frameRate: quality.frameRate ?? this.metrics.frameRate,
      latencyMs: quality.latencyMs ?? this.metrics.latencyMs
    };

    return this.getState();
  }

  getState() {
    return structuredClone(this.metrics);
  }

  reset() {
    this.metrics = {
      connection: "disconnected",
      status: "idle",
      frames: 0,
      freshness: 0,
      duplicateRate: 0,
      frameRate: 0,
      latencyMs: 0
    };
  }
}
