/** Haemoglobin processing is unavailable until acquisition and metadata validation. */
export class HbLiveStream {
  constructor() { this.listeners = new Set(); }
  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }
  start() { throw new Error("HbO/HbR processing requires validated acquisition, wavelength/geometry metadata, and a tested conversion pipeline."); }
  push() { this.start(); }
  stop() {}
}
