import { describe, expect, it, vi } from "vitest";
import { PacketInspector } from "../../src/ble/packet-inspector.js";

describe("Mendi acquisition packet inspection", () => {
  it("can inspect packets from multiple Mendi characteristics independently", () => {
    const inspector = new PacketInspector();

    inspector.record({
      characteristicUuid: "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
      bytes: new Uint8Array([1, 2, 3]),
      timestampMs: 1000
    });

    inspector.record({
      characteristicUuid: "fc3eabb4-c6c4-49e6-922a-6e551c455af5",
      bytes: new Uint8Array([10, 20]),
      timestampMs: 1012
    });

    inspector.record({
      characteristicUuid: "fc3eabb5-c6c4-49e6-922a-6e551c455af5",
      bytes: new Uint8Array([255, 0]),
      timestampMs: 1025
    });

    const summary = inspector.getSummary();

    expect(summary.totalPackets).toBe(3);
    expect(summary.byCharacteristic.ABB1).toBe(1);
    expect(summary.byCharacteristic.ABB4).toBe(1);
    expect(summary.byCharacteristic.ABB5).toBe(1);

    expect(summary.packetLengths.ABB1).toEqual([3]);
    expect(summary.packetLengths.ABB4).toEqual([2]);
    expect(summary.packetLengths.ABB5).toEqual([2]);

    expect(summary.intervalsMs).toEqual([12, 13]);
  });
});
