import { isMendiCharacteristic } from "./characteristic-utils.js";

export class PacketInspector {
  constructor() {
    this.packets = [];
  }

  record(packet) {
    const bytes = Array.from(Uint8Array.from(packet.bytes));

    this.packets.push({
      characteristicUuid: packet.characteristicUuid,
      timestampMs: packet.timestampMs,
      bytes,
      hex: bytes
        .map((byte) => byte.toString(16).padStart(2, "0").toUpperCase())
        .join(" ")
    });
  }

  getPackets() {
    return structuredClone(this.packets);
  }

  getSummary() {
    const byCharacteristic = {
      ABB1: 0,
      ABB4: 0,
      ABB5: 0,
      ABB6: 0,
      unknown: 0
    };

    const packetLengths = {
      ABB1: [],
      ABB4: [],
      ABB5: [],
      ABB6: [],
      unknown: []
    };

    const timestamps = [];

    for (const packet of this.packets) {
      const keys = ["ABB1", "ABB4", "ABB5", "ABB6"];

      const key =
        keys.find((candidate) =>
          isMendiCharacteristic(packet.characteristicUuid, candidate)
        ) ?? "unknown";

      byCharacteristic[key] += 1;
      packetLengths[key].push(packet.bytes.length);

      if (Number.isFinite(packet.timestampMs)) {
        timestamps.push(packet.timestampMs);
      }
    }

    const intervalsMs = [];

    for (let i = 1; i < timestamps.length; i += 1) {
      intervalsMs.push(timestamps[i] - timestamps[i - 1]);
    }

    return {
      totalPackets: this.packets.length,
      byCharacteristic,
      packetLengths,
      intervalsMs
    };
  }

  clear() {
    this.packets = [];
  }
}
