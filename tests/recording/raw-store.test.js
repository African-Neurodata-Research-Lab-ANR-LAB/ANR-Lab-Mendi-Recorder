import { describe, expect, it } from "vitest";
import { RawStore } from "../../src/recording/raw-store.js";

describe("RawStore", () => {
  it("preserves packet bytes as a copy", () => {
    const store = new RawStore();
    const bytes = new Uint8Array([1,2,3]);
    store.append({timestampMs:1,timeS:0,characteristicUuid:"abb1",bytes});
    bytes[0] = 99;
    expect(store.getAll()[0].bytes).toEqual([1,2,3]);
  });
});
