import { SampleClock } from "./sample-clock.js";
import { RawStore } from "./raw-store.js";
import { MarkerStore } from "./marker-store.js";

export class Session {
  constructor({ clock = new SampleClock() } = {}) {
    this.clock = clock;
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

    const timestampMs =
      packet.timestampMs ??
      packet.receivedAtMs;

    this.raw.append({
      ...packet,
      timestampMs,
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

  addMarker(
    description,
    source = "manual",
    details = {}
  ) {
    return this.addMarkerAt({
      onset: this.clock.nowSeconds(),
      duration: details.duration ?? 0,
      trialType:
        details.trialType ?? description,
      markerType:
        details.markerType ?? source,
      phase:
        details.phase ?? null,
      cycle:
        details.cycle ?? null,
      description,
      source
    });
  }

  addMarkerAt(event) {
    if (this.status !== "recording") {
      return null;
    }

    return this.markers.add({
      onset: event.onset,
      protocolTime:
        event.protocolTime ?? null,
      duration: event.duration ?? 0,
      trialType:
        event.trialType ??
        event.description,
      markerType:
        event.markerType ??
        event.source ??
        "manual",
      phase:
        event.phase ?? null,
      cycle:
        event.cycle ?? null,
      description: event.description,
      source:
        event.source ?? "manual"
    });
  }

  stop() {
    if (this.status !== "recording") {
      return;
    }

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
      metadata:
        structuredClone(this.metadata),
      raw: this.raw.getAll(),
      decoded:
        structuredClone(this.decoded),
      markers: this.markers.all(),
      status: this.status
    };
  }
}

