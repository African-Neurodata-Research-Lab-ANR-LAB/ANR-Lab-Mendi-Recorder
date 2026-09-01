import { describe, expect, it } from "vitest";
import { createPacketInspectionState } from "../../src/app/packet-inspection-state.js";

describe("controller packet inspection state", () => {
  it("updates live packet inspection statistics from PacketInspector", () => {
    const inspector = {
      getSummary: () => ({
        totalPackets: 12,
        byCharacteristic: {
          ABB1: 8,
          ABB4: 3,
          ABB5: 1,
          unknown: 0
        },
        packetLengths: {
          ABB1: [12],
          ABB4: [6],
          ABB5: [4],
          unknown: []
        },
        intervalsMs: [8, 9, 8]
      })
    };

    const state = createPacketInspectionState(inspector);

    expect(state.totalPackets).toBe(12);
    expect(state.byCharacteristic.ABB1).toBe(8);
    expect(state.byCharacteristic.ABB4).toBe(3);
    expect(state.byCharacteristic.ABB5).toBe(1);
    expect(state.byCharacteristic.unknown).toBe(0);
    expect(state.intervalsMs).toEqual([8, 9, 8]);
  });
});
