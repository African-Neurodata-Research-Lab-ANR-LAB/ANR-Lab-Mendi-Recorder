import { describe, expect, it } from "vitest";
import {
  normalizeProtocol,
  buildProtocolTimeline,
  protocolMarkerLabel
} from "../../src/markers/protocol-model.js";

describe("Protocol model", () => {
  it("builds a repeated absolute timeline", () => {
    const protocol = normalizeProtocol({
      repeatCount: 2,
      phases: [
        {
          name: "Baseline",
          type: "baseline",
          durationSeconds: 30,
          autoMarkerEnabled: true
        },
        {
          name: "Task 1",
          type: "task",
          durationSeconds: 60,
          autoMarkerEnabled: true
        }
      ]
    });

    const timeline = buildProtocolTimeline(protocol);

    expect(timeline).toHaveLength(4);

    expect(timeline[0]).toMatchObject({
      cycle: 1,
      startSeconds: 0,
      endSeconds: 30
    });

    expect(timeline[1]).toMatchObject({
      cycle: 1,
      startSeconds: 30,
      endSeconds: 90
    });

    expect(timeline[2]).toMatchObject({
      cycle: 2,
      startSeconds: 90,
      endSeconds: 120
    });

    expect(timeline[3]).toMatchObject({
      cycle: 2,
      startSeconds: 120,
      endSeconds: 180
    });
  });

  it("normalizes phase marker labels", () => {
    expect(
      protocolMarkerLabel("Task 1", "start")
    ).toBe("TASK_1_START");

    expect(
      protocolMarkerLabel("Baseline", "end")
    ).toBe("BASELINE_END");
  });

  it("rejects zero-duration phases", () => {
    expect(() =>
      normalizeProtocol({
        phases: [
          {
            name: "Baseline",
            type: "baseline",
            durationSeconds: 0
          }
        ]
      })
    ).toThrow("durationSeconds");
  });
});

it("supports get_ready phases with AutoMarker off by default", () => {
  const protocol = normalizeProtocol({
    phases: [
      {
        name: "Get Ready",
        type: "get_ready",
        durationSeconds: 5
      }
    ]
  });

  expect(protocol.phases[0]).toMatchObject({
    name: "Get Ready",
    type: "get_ready",
    durationSeconds: 5,
    autoMarkerEnabled: false
  });
});
