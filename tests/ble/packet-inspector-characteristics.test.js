import { describe, expect, it } from "vitest";
import { PacketInspector } from "../../src/ble/packet-inspector.js";

describe("Mendi packet inspector characteristic routing", () => {
  it("counts ABB1, ABB4 and ABB5 independently without interpreting their bytes", () => {
    const inspector = new PacketInspector();

    inspector.record({
      characteristicUuid: "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
      bytes: [1, 2, 3],
      timestampMs: 1000
    });

    inspector.record({
      characteristicUuid: "fc3eabb4-c6c4-49e6-922a-6e551c455af5",
      bytes: [10, 20],
      timestampMs: 1010
    });

    inspector.record({
      characteristicUuid: "fc3eabb5-c6c4-49e6-922a-6e551c455af5",
      bytes: [30, 40, 50, 60],
      timestampMs: 1020
    });

    const summary = inspector.getSummary();

    expect(summary.totalPackets).toBe(3);
    expect(summary.byCharacteristic.ABB1).toBe(1);
    expect(summary.byCharacteristic.ABB4).toBe(1);
    expect(summary.byCharacteristic.ABB5).toBe(1);

    expect(summary.byCharacteristic.ABB1).not.toHaveProperty("red");
    expect(summary.byCharacteristic.ABB1).not.toHaveProperty("ir");
    expect(summary.byCharacteristic.ABB1).not.toHaveProperty("ambient");
    expect(summary.byCharacteristic.ABB1).not.toHaveProperty("imu");

    const packets = inspector.getPackets();

    expect(packets[0].bytes).toEqual([1, 2, 3]);
    expect(packets[1].bytes).toEqual([10, 20]);
    expect(packets[2].bytes).toEqual([30, 40, 50, 60]);
  });
});
