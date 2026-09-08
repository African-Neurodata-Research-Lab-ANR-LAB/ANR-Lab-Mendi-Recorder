import { describe, expect, it } from "vitest";
import { extractOpticalSample } from "../../src/protocol/optical-extractor.js";

describe("optical sample extraction", () => {

  it("extracts valid left channel optical data", () => {

    const frame = {
      decoded: true,

      left: {
        red: 1000,
        ir: 2000,
        ambient: 100
      },

      right: {
        red: 3000,
        ir: 4000,
        ambient: 200
      }
    };


    const sample =
      extractOpticalSample(frame);


    expect(sample).toEqual({
      red: 1000,
      infrared: 2000
    });

  });


  it("rejects undecoded frames", () => {

    const frame = {
      decoded: false
    };


    expect(
      extractOpticalSample(frame)
    ).toBeNull();

  });

});