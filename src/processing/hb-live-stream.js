/**
 * Commit 29
 * Raw Optical -> HbO/HbR Processing Bridge
 *
 * Converts decoded Mendi optical samples into a live fNIRS preview stream.
 * This is a relative Hb calculation layer. Final calibrated MBLL processing
 * can replace this module later without changing the visualization pipeline.
 */

export class HbLiveStream {
  constructor({ streamManager, baselineFrames = 100 }) {
    this.streamManager = streamManager;
    this.baselineFrames = baselineFrames;
    this.unsubscribe = null;
    this.samples = [];
    this.listeners = [];
    this.baseline = null;
  }

  subscribe(callback) {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  emit(sample) {
    this.listeners.forEach((listener) => listener(sample));
  }

  extractOptical(packet) {
    const data = packet?.sample ?? packet?.optical ?? packet;

    return {
      leftRed: Number(data?.left_red ?? data?.leftRed ?? 0),
      leftIR: Number(data?.left_ir ?? data?.leftIR ?? 0),
      rightRed: Number(data?.right_red ?? data?.rightRed ?? 0),
      rightIR: Number(data?.right_ir ?? data?.rightIR ?? 0),
      timestamp: packet?.timestamp ?? Date.now() / 1000
    };
  }

  calculateHb(red, ir, baseline) {
    if (!baseline) {
      return { hbo: 0, hbr: 0 };
    }

    const redChange = (baseline.red - red) / baseline.red;
    const irChange = (baseline.ir - ir) / baseline.ir;

    return {
      hbo: Number((irChange * 6 - redChange * 2).toFixed(3)),
      hbr: Number((redChange * 3 - irChange * 1.5).toFixed(3))
    };
  }

  updateBaseline(sample) {
    if (this.samples.length < this.baselineFrames) {
      this.samples.push(sample);
      return;
    }

    if (!this.baseline) {
      const avg = (key) =>
        this.samples.reduce((sum, value) => sum + value[key], 0) /
        this.samples.length;

      this.baseline = {
        left: {
          red: avg("leftRed"),
          ir: avg("leftIR")
        },
        right: {
          red: avg("rightRed"),
          ir: avg("rightIR")
        }
      };
    }
  }

  start() {
    if (!this.streamManager) {
      throw new Error("StreamManager is required");
    }

    this.unsubscribe = this.streamManager.subscribe((packet) => {
      const optical = this.extractOptical(packet);

      this.updateBaseline(optical);

      if (!this.baseline) return;

      const output = {
        timestamp: optical.timestamp,
        left: this.calculateHb(
          optical.leftRed,
          optical.leftIR,
          this.baseline.left
        ),
        right: this.calculateHb(
          optical.rightRed,
          optical.rightIR,
          this.baseline.right
        )
      };

      this.emit(output);
    });
  }

  stop() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
