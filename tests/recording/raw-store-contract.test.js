import { describe, expect, it } from "vitest";
import { RawStore } from "../../src/recording/raw-store.js";

describe("RawStore", () => {
  it("stores the packet timestamp and elapsed time", () => {
    const store = new RawStore();

    store.append({
      timestampMs: 123456,
      timeS: 1.25,
      characteristicUuid: "test-characteristic",
      bytes: new Uint8Array([1, 2, 3])
    });

    const packets = store.getAll();

    expect(packets).toHaveLength(1);
    expect(packets[0].timestampMs).toBe(123456);
    expect(packets[0].timeS).toBe(1.25);
    expect(packets[0].characteristicUuid).toBe("test-characteristic");
    expect(packets[0].bytes).toEqual([1, 2, 3]);
  });

  it("keeps stored bytes independent from the input buffer", () => {
    const store = new RawStore();

    const bytes = new Uint8Array([10, 20, 30]);

    store.append({
      timestampMs: 1000,
      timeS: 0,
      characteristicUuid: "test-characteristic",
      bytes
    });

    bytes[0] = 99;

    expect(store.getAll()[0].bytes).toEqual([10, 20, 30]);
  });

  it("reports the number of stored packets", () => {
    const store = new RawStore();

    store.append({
      timestampMs: 1000,
      timeS: 0,
      characteristicUuid: "test-characteristic",
      bytes: [1]
    });

    store.append({
      timestampMs: 2000,
      timeS: 1,
      characteristicUuid: "test-characteristic",
      bytes: [2]
    });

    expect(store.count()).toBe(2);
  });
});
