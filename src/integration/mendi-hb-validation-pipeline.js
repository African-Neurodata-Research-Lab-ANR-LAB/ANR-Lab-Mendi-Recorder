import { HbLiveStream } from "../processing/hb-live-stream.js";

/**
 * Runtime bridge for validating real ABB1 optical samples.
 * Keeps acquisition, processing, and rendering separated.
 */
export class MendiHbValidationPipeline {
  constructor({ renderer, dashboard } = {}) {
    this.hbStream = new HbLiveStream();
    this.renderer = renderer;
    this.dashboard = dashboard;

    this.frames = 0;
    this.startTime = performance.now();

    this.hbStream.subscribe((sample) => {
      this.frames += 1;

      if (this.renderer) {
        this.renderer.update(sample);
      }

      if (this.dashboard) {
        const elapsed = (performance.now() - this.startTime) / 1000;
        this.dashboard.update({
          frames: this.frames,
          sampleRate: elapsed > 0 ? this.frames / elapsed : 0,
          leftHbO: sample.left?.hbo ?? 0,
          leftHbR: sample.left?.hbr ?? 0,
          rightHbO: sample.right?.hbo ?? 0,
          rightHbR: sample.right?.hbr ?? 0,
          quality: "VALIDATING"
        });
      }
    });
  }

  pushOpticalSample(sample) {
    this.hbStream.push(sample);
  }
}
