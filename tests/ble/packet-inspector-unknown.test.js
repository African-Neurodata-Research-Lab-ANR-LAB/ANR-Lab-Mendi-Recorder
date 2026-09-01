import { describe, expect, it } from "vitest";
import { PacketInspector } from "../../src/ble/packet-inspector.js";

describe("Mendi packet inspector unknown characteristics", () => {
  it("preserves packets from undocumented characteristics as unknown", () => {
    const inspector = new PacketInspector();

    inspector.record({
      characteristicUuid: "fc3eabb6-c6c4-49e6-922a-6e551c455af5",
      bytes: [99, 88, 77],
      timestampMs: 2000
    });

    inspector.record({
      characteristicUuid: "12345678-1234-5678-1234-567812345678",
      bytes: [1, 2, 3, 4],
      timestampMs: 2010
    });

    const summary = inspector.getSummary();

    expect(summary.totalPackets).toBe(2);
    expect(summary.byCharacteristic.ABB6).toBe(1);
    expect(summary.byCharacteristic.unknown).toBe(1);

    const packets = inspector.getPackets();

    expect(packets[0].bytes).toEqual([99, 88, 77]);
    expect(packets[1].bytes).toEqual([1, 2, 3, 4]);
  });
});
