import { describe, expect, it, vi } from "vitest";
import { PacketInspector } from "../../src/ble/packet-inspector.js";
import { startAcquisition } from "../../src/app/acquisition.js";

describe("live acquisition packet inspection", () => {
  it("sends acquired packets to PacketInspector while preserving the normal callback", async () => {
    const inspector = new PacketInspector();
    const onPacket = vi.fn();

    const driver = {
      subscribe: vi.fn().mockImplementation(async (key, callback) => {
        if (key === "ABB1") {
          await callback({
            characteristicUuid:
              "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
            timestampMs: 1000,
            bytes: [1, 2, 3, 4]
          });
        }
      }),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    await startAcquisition(driver, onPacket, {
      packetInspector: inspector
    });

    expect(inspector.getPackets()).toHaveLength(1);
    expect(onPacket).toHaveBeenCalledTimes(1);
  });
});
