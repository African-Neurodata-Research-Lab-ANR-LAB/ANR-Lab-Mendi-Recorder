export class RawStore {
  constructor() {
    this.packets = [];
  }

  append({ timestampMs, timeS, characteristicUuid, bytes }) {
    const immutableBytes = Array.from(Uint8Array.from(bytes));
    this.packets.push({
      timestampMs,
      timeS,
      characteristicUuid,
      bytes: immutableBytes
    });
  }

  getAll() {
    return structuredClone(this.packets);
  }

  count() {
    return this.packets.length;
  }
}
