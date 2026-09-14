import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  ExperimentEngine
} from "../../src/markers/experiment-engine.js";

describe("ExperimentEngine", () => {
  it("coordinates protocol and AutoMarker events in chronological order", () => {
    let now = 0;
    const events = [];

    const session = {
      clock: {
        nowSeconds: () => now
      },
      addMarkerAt: event => {
        events.push(event);
        return event;
      }
    };

    const clearIntervalFn = vi.fn();

    const engine = new ExperimentEngine({
      session,
      setIntervalFn: () => 123,
      clearIntervalFn
    });

    engine.start({
      protocol: {
        phases: [
          {
            name: "Baseline",
            type: "baseline",
            durationSeconds: 10
          },
          {
            name: "Task",
            type: "task",
            durationSeconds: 10
          }
        ]
      },
      autoMarkerIntervalSeconds: 5
    });

    engine.tick();

    now = 10;
    engine.tick();

    expect(
      events.map(event => ({
        onset: event.onset,
        description: event.description
      }))
    ).toEqual([
      {
        onset: 0,
        description: "BASELINE_START"
      },
      {
        onset: 5,
        description: "AUTO_MARKER_001"
      },
      {
        onset: 10,
        description: "BASELINE_END"
      },
      {
        onset: 10,
        description: "TASK_START"
      },
      {
        onset: 10,
        description: "AUTO_MARKER_002"
      }
    ]);

    expect(
      engine.getState()
    ).toMatchObject({
      active: true,
      protocol: {
        phaseName: "Task",
        cycle: 1
      },
      autoMarker: {
        active: true,
        intervalSeconds: 5
      }
    });
  });

  it("stops protocol and AutoMarker together", () => {
    let now = 0;
    const events = [];

    const clearIntervalFn = vi.fn();

    const session = {
      clock: {
        nowSeconds: () => now
      },
      addMarkerAt: event => {
        events.push(event);
        return event;
      }
    };

    const engine = new ExperimentEngine({
      session,
      setIntervalFn: () => 777,
      clearIntervalFn
    });

    engine.start({
      protocol: {
        phases: [
          {
            name: "Baseline",
            type: "baseline",
            durationSeconds: 10
          }
        ]
      },
      autoMarkerIntervalSeconds: 5
    });

    engine.tick();

    engine.stop();

    now = 20;
    engine.tick();

    expect(
      engine.getState().active
    ).toBe(false);

    expect(
      engine.getState().autoMarker.active
    ).toBe(false);

    expect(clearIntervalFn)
      .toHaveBeenCalledWith(777);

    expect(
      events.map(event => event.description)
    ).toEqual([
      "BASELINE_START"
    ]);
  });

  it("stops automatically when the protocol finishes", () => {
    let now = 0;

    const session = {
      clock: {
        nowSeconds: () => now
      },
      addMarkerAt: event => event
    };

    const engine = new ExperimentEngine({
      session,
      setIntervalFn: () => 55,
      clearIntervalFn: vi.fn()
    });

    engine.start({
      protocol: {
        phases: [
          {
            name: "Baseline",
            type: "baseline",
            durationSeconds: 10
          }
        ]
      },
      autoMarkerIntervalSeconds: 5
    });

    engine.tick();

    now = 10;
    engine.tick();

    expect(
      engine.getState().active
    ).toBe(false);

    expect(
      engine.getState().protocol.completed
    ).toBe(true);

    expect(
      engine.getState().autoMarker.active
    ).toBe(false);
  });
});
