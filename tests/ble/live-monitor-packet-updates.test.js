import { describe, expect, it } from "vitest";
import { PacketInspector } from "../../src/ble/packet-inspector.js";
import { createPacketInspectionState } from "../../src/app/packet-inspection-state.js";

describe("live technical monitor packet updates", () => {
  it("updates channel counts from PacketInspector summaries", () => {
    const inspector = new PacketInspector();

    inspector.record({
      characteristicUuid: "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
      timestampMs: 1000,
      bytes: [1, 2, 3]
    });

    inspector.record({
      characteristicUuid: "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
      timestampMs: 1010,
      bytes: [4, 5, 6]
    });

    inspector.record({
      characteristicUuid: "fc3eabb4-c6c4-49e6-922a-6e551c455af5",
      timestampMs: 1020,
      bytes: [7, 8]
    });

    inspector.record({
      characteristicUuid: "fc3eabb5-c6c4-49e6-922a-6e551c455af5",
      timestampMs: 1030,
      bytes: [9]
    });

    const state = createPacketInspectionState(inspector);

    expect(state.get()).toEqual({
      totalPackets: 4,
      byCharacteristic: {
        ABB1: 2,
        ABB4: 1,
        ABB5: 1,
        unknown: 0
      },
      packetRateHz: expect.any(Number)
    });
  });
});
