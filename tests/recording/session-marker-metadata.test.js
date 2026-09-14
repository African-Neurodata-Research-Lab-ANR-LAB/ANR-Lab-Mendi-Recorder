import { describe, expect, it, vi } from "vitest";
import { Session } from "../../src/recording/session.js";

function makeClock(time = 0) {
  return {
    start: vi.fn(),
    nowSeconds: vi.fn(() => time),
    wallNowMs: vi.fn(() => 1000)
  };
}

describe("Session marker metadata", () => {
  it("uses the session clock for normal markers", () => {
    const clock = makeClock(12.5);
    const session = new Session({ clock });

    session.start({ participantCode: "P001" });

    const marker = session.addMarker(
      "BUTTON_PRESS",
      "manual",
      {
        trialType: "response",
        markerType: "manual",
        phase: "Task 1",
        cycle: 1
      }
    );

    expect(marker).toMatchObject({
      onset: 12.5,
      duration: 0,
      trialType: "response",
      markerType: "manual",
      phase: "Task 1",
      cycle: 1,
      description: "BUTTON_PRESS",
      source: "manual"
    });
  });

  it("stores an event at an explicitly supplied protocol time", () => {
    const session = new Session({ clock: makeClock(15) });
    session.start({});

    const marker = session.addMarkerAt({
      onset: 10,
      duration: 0,
      trialType: "baseline",
      markerType: "phase_boundary",
      phase: "Baseline",
      cycle: 1,
      description: "BASELINE_END",
      source: "protocol"
    });

    expect(marker.onset).toBe(10);
    expect(marker.description).toBe("BASELINE_END");
  });
});
