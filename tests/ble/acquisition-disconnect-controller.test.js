import { describe, expect, it, vi } from "vitest";
import { handleAcquisitionDisconnect } from "../../src/app/acquisition.js";

describe("acquisition disconnect controller notification", () => {
  it("passes the disconnect event to the controller callback", async () => {
    const driver = {
      subscribe: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    const onDisconnected = vi.fn();

    await handleAcquisitionDisconnect(driver, { onDisconnected });

    expect(onDisconnected).toHaveBeenCalledTimes(1);
  });
});
