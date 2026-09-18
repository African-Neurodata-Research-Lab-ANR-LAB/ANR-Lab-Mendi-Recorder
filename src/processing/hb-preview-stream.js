import { createHbPreviewProcessor } from "./fnirs-hb-preview.js";

/**
 * Connects optical samples from the live stream to the HbO/HbR preview layer.
 * This is a preview only and does not replace calibrated MBLL processing.
 */
export class HbPreviewStream {
  constructor({ processor = createHbPreviewProcessor(), onUpdate = null } = {}) {
    this.processor = processor;
    this.onUpdate = onUpdate;
    this.latest = null;
  }

  push(sample) {
    const result = this.processor.process(sample);

    this.latest = result;

    if (typeof this.onUpdate === "function") {
      this.onUpdate(result);
    }

    return result;
  }

  getLatest() {
    return this.latest;
  }
}
