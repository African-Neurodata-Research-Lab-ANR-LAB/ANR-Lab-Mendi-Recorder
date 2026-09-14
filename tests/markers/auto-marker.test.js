import { describe, expect, it } from "vitest";
import {
  AutoMarkerScheduler
} from "../../src/markers/auto-marker.js";

describe("AutoMarkerScheduler", () => {
  it("creates exact interval markers", () => {
    let now = 0;
    const events = [];

    const scheduler = new AutoMarkerScheduler({
      clock: {
        nowSeconds: () => now
      },
      addMarker: event => events.push(event),
      getContextAt: () => ({
        phase: {
          name: "Task",
          type: "task",
          autoMarkerEnabled: true
        },
        cycle: 1
      })
    });

    scheduler.start({
      intervalSeconds: 5
    });

    now = 12;
    scheduler.tick();

    expect(
      events.map(event => ({
        onset: event.onset,
        description: event.description,
        phase: event.phase,
        cycle: event.cycle
      }))
    ).toEqual([
      {
        onset: 5,
        description: "AUTO_MARKER_001",
        phase: "Task",
        cycle: 1
      },
      {
        onset: 10,
        description: "AUTO_MARKER_002",
        phase: "Task",
        cycle: 1
      }
    ]);
  });

  it("does not emit inside a phase that disables AutoMarker", () => {
    let now = 10;
    const events = [];

    const scheduler = new AutoMarkerScheduler({
      clock: {
        nowSeconds: () => now
      },
      addMarker: event => events.push(event),
      getContextAt: () => ({
        phase: {
          name: "Rest",
          type: "rest",
          autoMarkerEnabled: false
        },
        cycle: 1
      })
    });

    scheduler.start({
      intervalSeconds: 5
    });

    expect(
      scheduler.getState().active
    ).toBe(true);

    scheduler.tick();

    expect(events).toEqual([]);

    expect(
      scheduler.getState().nextAtSeconds
    ).toBe(15);
  });

  it("stops producing markers after stop", () => {
    let now = 5;
    const events = [];

    const scheduler = new AutoMarkerScheduler({
      clock: {
        nowSeconds: () => now
      },
      addMarker: event => events.push(event),
      getContextAt: () => ({
        phase: {
          name: "Task",
          type: "task",
          autoMarkerEnabled: true
        },
        cycle: 1
      })
    });

    scheduler.start({
      intervalSeconds: 5
    });

    scheduler.tick();

    expect(
      events.map(event => event.description)
    ).toEqual([
      "AUTO_MARKER_001"
    ]);

    scheduler.stop();

    now = 20;
    scheduler.tick();

    expect(
      events.map(event => event.description)
    ).toEqual([
      "AUTO_MARKER_001"
    ]);

    expect(
      scheduler.getState().active
    ).toBe(false);
  });

  it("reports truthful scheduler state", () => {
    const scheduler = new AutoMarkerScheduler({
      clock: {
        nowSeconds: () => 0
      },
      addMarker: () => {},
      getContextAt: () => null
    });

    expect(
      scheduler.getState()
    ).toMatchObject({
      active: false
    });

    scheduler.start({
      intervalSeconds: 10
    });

    expect(
      scheduler.getState()
    ).toMatchObject({
      active: true,
      intervalSeconds: 10,
      nextAtSeconds: 10,
      emittedCount: 0
    });

    scheduler.stop();

    expect(
      scheduler.getState().active
    ).toBe(false);
  });
});
