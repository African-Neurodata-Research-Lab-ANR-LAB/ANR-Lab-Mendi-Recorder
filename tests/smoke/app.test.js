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
