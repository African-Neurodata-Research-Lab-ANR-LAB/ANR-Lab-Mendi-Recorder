import { describe, expect, it } from "vitest";
import { LiveTraceBuffer } from "../../src/visualization/live-trace-buffer.js";
import { extractOpticalSample } from "../../src/protocol/optical-extractor.js";
import { renderTrace } from "../../src/visualization/trace-renderer.js";

describe("optical rendering pipeline", () => {

  it("extracts, buffers, and renders optical samples", () => {

    const buffer = new LiveTraceBuffer(5);

    const frame1 = {
      decoded: true,
      left: {
        red: 1000,
        ir: 2000
      }
    };

    const frame2 = {
      decoded: true,
      left: {
        red: 1100,
        ir: 2100
      }
    };

    buffer.push(extractOpticalSample(frame1));
    buffer.push(extractOpticalSample(frame2));

    let strokeCount = 0;

    const context = {
      clearRect() {},
      beginPath() {},
      moveTo() {},
      lineTo() {},
      stroke() {
        strokeCount += 1;
      }
    };

    const canvas = {
      width: 500,
      height: 200,
      getContext() {
        return context;
      }
    };

    renderTrace(
      canvas,
      buffer.get()
    );

    expect(buffer.get()).toEqual({
      red: [1000, 1100],
      infrared: [2000, 2100]
    });

    expect(strokeCount).toBe(2);

  });

});
