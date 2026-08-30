import { describe, expect, it } from "vitest";
import { decodeFrame } from "../../src/protocol/frame-decoder.js";

describe("Frame decoder", () => {
  it("never invents scientific values for unknown frames", () => {
    const result = decodeFrame([1,2,3,4]);
    expect(result.decoded).toBe(false);
    expect(result.left.red).toBeNull();
    expect(result.right.ir).toBeNull();
  });
});
