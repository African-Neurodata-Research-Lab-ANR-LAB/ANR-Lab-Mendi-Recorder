import { SampleClock } from "./sample-clock.js";
import { RawStore } from "./raw-store.js";
import { MarkerStore } from "./marker-store.js";

export class Session {
  constructor() {
    this.clock = new SampleClock();
    this.raw = new RawStore();
    this.markers = new MarkerStore();
    this.decoded = [];
    this.metadata = {};
    this.status = "idle";
  }

  start(metadata) {
    this.metadata = structuredClone(metadata);
    this.clock.start();
    this.status = "recording";
    this.markers.add({
      onset: 0,
      duration: 0,
      description: "START_RECORDING",
      source: "system"
    });
  }

  appendRaw(packet) {
    if (this.status !== "recording") return;
    this.raw.append({
      ...packet,
      timeS: this.clock.nowSeconds()
    });
  }

  appendDecoded(sample) {
    if (this.status !== "recording") return;
    this.decoded.push({
      ...structuredClone(sample),
      timeS: this.clock.nowSeconds()
    });
  }

  addMarker(description, source = "manual") {
    return this.markers.add({
      onset: this.clock.nowSeconds(),
      description,
      source
    });
  }

  stop() {
    if (this.status !== "recording") return;
    this.markers.add({
      onset: this.clock.nowSeconds(),
      duration: 0,
      description: "STOP_RECORDING",
      source: "system"
    });
    this.status = "stopped";
  }

  snapshot() {
    return {
      metadata: structuredClone(this.metadata),
      raw: this.raw.getAll(),
      decoded: structuredClone(this.decoded),
      markers: this.markers.all(),
      status: this.status
    };
  }
}
