export class PacketInspector {
  constructor() {
    this.packets = [];
    this.statistics = {
      totalPackets: 0,
      totalBytes: 0,
      duplicatePackets: 0
    };
  }

  inspect(packet, validation = null) {
    const timestamp = packet.timestampMs ?? Date.now();
    const bytes = packet instanceof Uint8Array
      ? packet
      : new Uint8Array(packet);

    const record = {
      timestamp,
      length: bytes.length,
      hash: validation?.hash ?? null,
      duplicate: validation?.duplicate ?? false,
      bytes: Array.from(bytes)
    };

    this.packets.push(record);

    this.statistics.totalPackets += 1;
    this.statistics.totalBytes += bytes.length;

    if (record.duplicate) {
      this.statistics.duplicatePackets += 1;
    }

    return record;
  }

  getReport() {
    const count = this.statistics.totalPackets;

    return {
      ...this.statistics,
      duplicateRate: count === 0
        ? 0
        : (this.statistics.duplicatePackets / count) * 100,
      averagePacketSize: count === 0
        ? 0
        : this.statistics.totalBytes / count
    };
  }

  reset() {
    this.packets = [];
    this.statistics = {
      totalPackets: 0,
      totalBytes: 0,
      duplicatePackets: 0
    };
  }
}
