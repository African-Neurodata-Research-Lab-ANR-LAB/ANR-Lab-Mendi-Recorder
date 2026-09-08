import { describe, expect, it } from "vitest";
import { LiveTraceBuffer } from "../../src/visualization/live-trace-buffer.js";

describe("live optical trace buffer", () => {

  it("stores red and infrared samples", () => {

    const buffer = new LiveTraceBuffer(5);

    buffer.push({
      red: 100,
      infrared: 200
    });

    const snapshot = buffer.get();

    expect(snapshot.red).toEqual([100]);
    expect(snapshot.infrared).toEqual([200]);

  });


  it("keeps only the latest samples", () => {

    const buffer = new LiveTraceBuffer(3);

    buffer.push({ red: 1, infrared: 10 });
    buffer.push({ red: 2, infrared: 20 });
    buffer.push({ red: 3, infrared: 30 });
    buffer.push({ red: 4, infrared: 40 });

    const snapshot = buffer.get();

    expect(snapshot.red).toEqual([2, 3, 4]);
    expect(snapshot.infrared).toEqual([20, 30, 40]);

  });

});