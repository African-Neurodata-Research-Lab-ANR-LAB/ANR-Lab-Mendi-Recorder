import { describe, expect, it } from "vitest";
import { Session } from "../../src/recording/session.js";

describe("Session raw packet timing contract", () => {
  it("maps notification reception time to timestampMs", () => {
    const session = new Session();

    session.start({
      participantCode: "P001",
      sessionCode: "S001",
      protocol: "test"
    });

    session.appendRaw({
      receivedAtMs: 123456,
      characteristicUuid: "abb1",
      bytes: new Uint8Array([1, 2, 3])
    });

    const packet = session.raw.getAll()[0];

    expect(packet.timestampMs).toBe(123456);
    expect(packet.timeS).toBeGreaterThanOrEqual(0);
    expect(packet.characteristicUuid).toBe("abb1");
    expect(packet.bytes).toEqual([1, 2, 3]);
  });

  it("preserves an explicit timestampMs when supplied", () => {
    const session = new Session();

    session.start({
      participantCode: "P001",
      sessionCode: "S001",
      protocol: "test"
    });

    session.appendRaw({
      timestampMs: 999999,
      receivedAtMs: 123456,
      characteristicUuid: "abb4",
      bytes: [4, 5, 6]
    });

    const packet = session.raw.getAll()[0];

    expect(packet.timestampMs).toBe(999999);
  });
});
