import { describe, expect, it } from "vitest";
import { PacketInspector } from "../../src/ble/packet-inspector.js";

describe("Mendi packet inspector", () => {
  it("records raw packets without interpreting their scientific meaning", () => {
    const inspector = new PacketInspector();

    inspector.record({
      characteristicUuid: "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
      bytes: new Uint8Array([1, 2, 3, 255]),
      timestampMs: 1000
    });

    const packets = inspector.getPackets();

    expect(packets).toHaveLength(1);
    expect(packets[0].characteristicUuid).toBe(
      "fc3eabb1-c6c4-49e6-922a-6e551c455af5"
    );
    expect(packets[0].bytes).toEqual([1, 2, 3, 255]);
    expect(packets[0].hex).toBe("01 02 03 FF");
    expect(packets[0].timestampMs).toBe(1000);

    // The inspector must not invent optical/IMU values.
    expect(packets[0]).not.toHaveProperty("leftRed");
    expect(packets[0]).not.toHaveProperty("rightRed");
    expect(packets[0]).not.toHaveProperty("imu");
  });
});
