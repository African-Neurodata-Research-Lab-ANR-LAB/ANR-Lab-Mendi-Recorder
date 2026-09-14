import { describe, expect, it } from "vitest";

import {
  rawPacketsCsv
} from "../../src/export/csv.js";

import {
  createSnirf
} from "../../src/export/snirf.js";

import {
  eventsTsv
} from "../../src/export/tsv.js";

describe("Exports", () => {
  it("exports raw packets", () => {
    const csv = rawPacketsCsv([
      {
        timestampMs: 1,
        timeS: 0.1,
        characteristicUuid: "abb1",
        bytes: [1, 2]
      }
    ]);

    expect(csv).toContain(
      "timestamp_ms"
    );

    expect(csv).toContain(
      "1 2"
    );
  });

  it("gates SNIRF when scientific metadata is incomplete", () => {
    expect(
      createSnirf({}).available
    ).toBe(false);
  });

  it("exports research event metadata", () => {
    const tsv = eventsTsv([
      {
        onset: 10,
        duration: 0,
        trialType: "task",
        markerType: "phase_boundary",
        phase: "Task 1",
        cycle: 1,
        description: "TASK_1_START",
        source: "protocol"
      },
      {
        onset: 15,
        duration: 0,
        trialType: "task",
        markerType: "auto_marker",
        phase: "Task 1",
        cycle: 1,
        description: "AUTO_MARKER_001",
        source: "auto_marker"
      }
    ]);

    expect(tsv).toContain(
      [
        "onset",
        "duration",
        "trial_type",
        "marker_type",
        "phase",
        "cycle",
        "description",
        "source"
      ].join("\t")
    );

    expect(tsv).toContain(
      [
        "10",
        "0",
        "task",
        "phase_boundary",
        "Task 1",
        "1",
        "TASK_1_START",
        "protocol"
      ].join("\t")
    );

    expect(tsv).toContain(
      "AUTO_MARKER_001"
    );
  });
});
