import { LiveTraceBuffer } from "./live-trace-buffer.js";
import { renderTrace } from "./trace-renderer.js";

function extractOpticalSample(enrichedPacket) {
  const candidate =
    enrichedPacket?.packet ?? enrichedPacket;

  return (
    candidate?.sample ??
    candidate?.optical ??
    candidate?.sensor ??
    candidate
  );
}

/**
 * Connects the acquisition stream bus to the live optical waveform.
 * BLE remains independent; this only subscribes to decoded stream output.
 */
export class LiveStreamBridge {
  constructor({ streamManager, canvas, bufferLimit = 500, markers = [] }) {
    this.streamManager = streamManager;
    this.canvas = canvas;
    this.buffer = new LiveTraceBuffer(bufferLimit);
    this.markers = markers;
    this.unsubscribe = null;
  }

  start() {
    if (!this.streamManager) {
      throw new Error("StreamManager is required");
    }

    this.unsubscribe = this.streamManager.subscribe((packet) => {
      const sample = extractOpticalSample(packet);

      this.buffer.push(
        sample,
        Date.now() / 1000
      );

      renderTrace(
        this.canvas,
        this.buffer.getDual().left,
        {
          markers: this.markers
        }
      );
    });

    return {
      status: "connected"
    };
  }

  stop() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    return {
      status: "stopped"
    };
  }

  getTrace() {
    return this.buffer.getDual();
  }
}
