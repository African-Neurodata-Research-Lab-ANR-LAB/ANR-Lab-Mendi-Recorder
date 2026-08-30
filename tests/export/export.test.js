import { describe, expect, it } from "vitest";
import { rawPacketsCsv } from "../../src/export/csv.js";
import { createSnirf } from "../../src/export/snirf.js";

describe("Exports", () => {
  it("exports raw packets", () => {
    const csv = rawPacketsCsv([
      {timestampMs:1,timeS:0.1,characteristicUuid:"abb1",bytes:[1,2]}
    ]);
    expect(csv).toContain("timestamp_ms");
    expect(csv).toContain("1 2");
  });

  it("gates SNIRF when scientific metadata is incomplete", () => {
    expect(createSnirf({}).available).toBe(false);
  });
});
