// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  ExperimentEngine
} from "../../src/markers/experiment-engine.js";

it("invokes browser timer functions with the global receiver", () => {
  function browserTimer(callback, delay) {
    if (this !== globalThis) {
      throw new TypeError("Illegal invocation");
    }

    expect(typeof callback).toBe("function");
    expect(delay).toBe(100);
    return 123;
  }

  function browserClearTimer(timerId) {
    if (this !== globalThis) {
      throw new TypeError("Illegal invocation");
    }

    expect(timerId).toBe(123);
  }

  const session = {
    clock: {
      nowSeconds() {
        return 0;
      }
    },
    addMarkerAt() {}
  };

  const engine =
    new ExperimentEngine({
      session,
      setIntervalFn: browserTimer,
      clearIntervalFn: browserClearTimer
    });

  expect(() =>
    engine.start({
      protocol: {
        repeatCount: 1,
        phases: [
          {
            id: "phase-1",
            name: "Baseline",
            type: "baseline",
            durationSeconds: 30,
            autoMarkerEnabled: true
          }
        ]
      }
    })
  ).not.toThrow();

  engine.stop();
});
