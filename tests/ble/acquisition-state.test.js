import { describe, expect, it, vi } from "vitest";
import { startAcquisition } from "../../src/app/acquisition.js";

describe("acquisition state lifecycle", () => {
  it("calls the failure handler after rolling back a failed acquisition", async () => {
    const driver = {
      subscribe: vi.fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error("ABB4 unavailable")),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    const onPacket = vi.fn();
    const onFailure = vi.fn();

    await expect(
      startAcquisition(driver, onPacket, { onFailure })
    ).rejects.toThrow("ABB4 unavailable");

    expect(onFailure).toHaveBeenCalledTimes(1);
    expect(onFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "ABB4 unavailable"
      })
    );
  });
});
