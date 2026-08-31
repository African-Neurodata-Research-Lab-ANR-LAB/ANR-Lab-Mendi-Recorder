import { describe, expect, it, vi } from "vitest";
import { createState } from "../../src/app/state.js";
import { startAcquisition } from "../../src/app/acquisition.js";

describe("acquisition failure state", () => {
  it("resets recording state when acquisition fails", async () => {
    const state = createState();

    state.recording = "recording";

    const driver = {
      subscribe: vi.fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error("ABB4 unavailable")),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    await expect(
      startAcquisition(driver, vi.fn(), {
        onFailure: () => {
          state.recording = "idle";
          state.error = "ABB4 unavailable";
        }
      })
    ).rejects.toThrow("ABB4 unavailable");

    expect(state.recording).toBe("idle");
    expect(state.error).toBe("ABB4 unavailable");
  });
});
