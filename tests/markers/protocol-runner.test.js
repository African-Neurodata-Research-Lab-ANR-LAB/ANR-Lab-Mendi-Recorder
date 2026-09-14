import { describe, expect, it } from "vitest";
import { ProtocolRunner } from "../../src/markers/protocol-runner.js";

describe("ProtocolRunner", () => {
  it("emits exact boundary events from session time", () => {
    let now = 0;
    const events = [];

    const runner = new ProtocolRunner({
      clock: {
        nowSeconds: () => now
      },
      addMarker: event => events.push(event)
    });

    runner.start({
      repeatCount: 1,
      phases: [
        {
          name: "Baseline",
          type: "baseline",
          durationSeconds: 10
        },
        {
          name: "Task",
          type: "task",
          durationSeconds: 20
        }
      ]
    });

    runner.tick();

    expect(
      events.map(event => event.description)
    ).toEqual([
      "BASELINE_START"
    ]);

    now = 10;
    runner.tick();

    expect(
      events.map(event => event.description)
    ).toEqual([
      "BASELINE_START",
      "BASELINE_END",
      "TASK_START"
    ]);

    now = 30;
    runner.tick();

    expect(
      events.map(event => event.description)
    ).toEqual([
      "BASELINE_START",
      "BASELINE_END",
      "TASK_START",
      "TASK_END"
    ]);

    expect(events[1].onset).toBe(10);
    expect(events[2].onset).toBe(10);
    expect(events[3].onset).toBe(30);
  });

  it("reports the active phase and remaining time", () => {
    let now = 12;

    const runner = new ProtocolRunner({
      clock: {
        nowSeconds: () => now
      },
      addMarker: () => {}
    });

    runner.start({
      phases: [
        {
          name: "Baseline",
          type: "baseline",
          durationSeconds: 10
        },
        {
          name: "Task",
          type: "task",
          durationSeconds: 20
        }
      ]
    });

    runner.tick();

    expect(runner.getState()).toMatchObject({
      active: true,
      phaseName: "Task",
      cycle: 1,
      phaseElapsedSeconds: 2,
      phaseRemainingSeconds: 18
    });
  });
});
