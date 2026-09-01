import { describe, expect, it } from "vitest";
import { createState } from "../../src/app/state.js";

describe("live technical monitor state", () => {
  it("starts with a complete monitor state", () => {
    const state = createState();

    expect(state.monitor).toEqual({
      elapsedSeconds: 0,
      packetRateHz: 0,
      signalQuality: "NO SIGNAL",
      contact: {
        left: "unknown",
        right: "unknown"
      },
      channels: {
        ABB1: 0,
        ABB4: 0,
        ABB5: 0,
        unknown: 0
      },
      imu: {
        enabled: true,
        status: "NOT AVAILABLE"
      },
      automarker: {
        enabled: true,
        lastEvent: null
      }
    });
  });
});
