// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { renderTrace } from "../../src/visualization/trace-renderer.js";


describe("technical trace renderer", () => {

  it("renders optical traces onto canvas", () => {

    const canvas = document.createElement("canvas");

    canvas.width = 500;
    canvas.height = 200;


    const calls = [];


    canvas.getContext = () => ({

      clearRect() {},

      beginPath() {},

      moveTo(x, y) {
        calls.push(["moveTo", x, y]);
      },

      lineTo(x, y) {
        calls.push(["lineTo", x, y]);
      },

      stroke() {}

    });


    renderTrace(canvas, {

      red: [
        10,
        20,
        30
      ],

      infrared: [
        15,
        25,
        35
      ]

    });


    expect(
      calls.length
    ).toBeGreaterThan(0);


    expect(
      calls[0][0]
    ).toBe("moveTo");

  });

});