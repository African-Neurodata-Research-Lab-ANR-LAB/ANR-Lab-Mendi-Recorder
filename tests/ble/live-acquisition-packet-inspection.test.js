import { describe, expect, it, vi } from "vitest";
import { startAcquisition } from "../../src/app/acquisition.js";
import { PacketInspector } from "../../src/ble/packet-inspector.js";

describe("live acquisition packet inspection", () => {
  it("sends every acquired packet to PacketInspector while preserving the normal callback", async () => {
    let callbacks = {};

    const driver = {
      subscribe: vi.fn().mockImplementation(async (key, callback) => {
        callbacks[key] = callback;
      }),
      unsubscribe: vi.fn().mockResolvedValue(undefined)
    };

    const inspector = new PacketInspector();
    const onPacket = vi.fn();

    const started = await startAcquisition(driver, onPacket, {
      packetInspector: inspector
    });

    expect(started).toBe(true);

    const packet = {
      characteristicUuid:
        "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
      timestampMs: 123456,
      bytes: [1, 2, 3, 4]
    };

    callbacks.ABB1(packet);

    expect(onPacket).toHaveBeenCalledWith(packet);

    const captured = inspector.getPackets();

    expect(captured).toHaveLength(1);
    expect(captured[0].characteristicUuid).toBe(
      "fc3eabb1-c6c4-49e6-922a-6e551c455af5"
    );
    expect(captured[0].timestampMs).toBe(123456);
    expect(captured[0].bytes).toEqual([1, 2, 3, 4]);
  });
});
