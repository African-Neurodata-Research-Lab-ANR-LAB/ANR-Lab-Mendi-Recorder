import { describe, expect, it } from "vitest";
import { createState } from "../../src/app/state.js";

describe("application packet inspection state", () => {
  it("starts with an empty packet inspection summary", () => {
    const state = createState();

    expect(state.packetInspection).toEqual({
      totalPackets: 0,
      byCharacteristic: {
        ABB1: 0,
        ABB4: 0,
        ABB5: 0,
        unknown: 0
      },
      packetLengths: {
        ABB1: [],
        ABB4: [],
        ABB5: [],
        unknown: []
      },
      intervalsMs: []
    });
  });
});
