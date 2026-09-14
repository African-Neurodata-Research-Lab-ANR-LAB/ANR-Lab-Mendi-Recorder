import { describe, expect, it } from "vitest";
import { createState } from "../../src/app/state.js";

describe("Recorder foundation", () => {
  it("creates a disconnected idle state", () => {
    const state = createState();
    expect(state.connection).toBe("disconnected");
    expect(state.recording).toBe("idle");
    expect(state.markers).toEqual([]);
  });
});

it("creates Phase 2 session and experiment state", () => {
  const state = createState();

  expect(state.sessionStatus).toBe("idle");

  expect(state.experiment).toEqual({
    sessionSeconds: 0,
    protocolSeconds: 0,
    phaseName: null,
    phaseType: null,
    phaseElapsedSeconds: 0,
    phaseRemainingSeconds: 0,
    cycle: null,
    totalCycles: null,
    nextPhaseName: null,
    progress: 0
  });
});
