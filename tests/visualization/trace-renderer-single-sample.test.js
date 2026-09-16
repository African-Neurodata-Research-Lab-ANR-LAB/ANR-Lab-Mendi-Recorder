// @vitest-environment jsdom

import {
  expect,
  it,
  vi
} from "vitest";

import {
  renderTrace
} from "../../src/visualization/trace-renderer.js";

it("renders a visible point when only one optical frame is available", () => {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 500;
  canvas.height = 200;

  const arc = vi.fn();
  const fill = vi.fn();

  canvas.getContext = () => ({
    clearRect() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
    arc,
    fill,
    set fillStyle(value) {}
  });

  renderTrace(
    canvas,
    {
      red: [24697],
      infrared: [82688],
      times: [1.5]
    }
  );

  expect(arc)
    .toHaveBeenCalled();

  expect(fill)
    .toHaveBeenCalled();
});
