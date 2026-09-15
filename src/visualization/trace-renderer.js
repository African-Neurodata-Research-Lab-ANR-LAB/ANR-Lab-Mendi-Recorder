function validPoints(samples) {
  return samples
    .map((value, index) => ({
      value,
      index
    }))
    .filter(
      point =>
        typeof point.value ===
          "number" &&
        Number.isFinite(point.value)
    );
}

function collectRange(traces) {
  const values = [
    ...(traces.red ?? []),
    ...(traces.infrared ?? [])
  ].filter(
    value =>
      typeof value === "number" &&
      Number.isFinite(value)
  );

  if (!values.length) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    const pad =
      Math.max(
        Math.abs(min) * 0.02,
        1
      );

    return {
      min: min - pad,
      max: max + pad
    };
  }

  const padding =
    (max - min) * 0.08;

  return {
    min: min - padding,
    max: max + padding
  };
}

function drawLine(
  context,
  samples,
  width,
  height,
  range,
  strokeStyle
) {
  const points =
    validPoints(samples);

  if (points.length < 2) {
    return;
  }

  const count =
    Math.max(
      samples.length,
      2
    );

  const plotTop = 16;
  const plotBottom =
    Math.max(
      plotTop + 1,
      height - 18
    );

  const plotHeight =
    plotBottom - plotTop;

  const plotWidth =
    Math.max(1, width - 1);

  const valueRange =
    range.max - range.min || 1;

  if (
    "strokeStyle" in context
  ) {
    context.strokeStyle =
      strokeStyle;
  }

  if (
    "lineWidth" in context
  ) {
    context.lineWidth = 1.7;
  }

  context.beginPath();

  points.forEach(
    (point, pointIndex) => {
      const x =
        (point.index /
          (count - 1)) *
        plotWidth;

      const normalized =
        (point.value - range.min) /
        valueRange;

      const y =
        plotBottom -
        normalized * plotHeight;

      if (pointIndex === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
  );

  context.stroke();
}

function drawMarkers(
  context,
  width,
  height,
  times,
  markers
) {
  if (
    !Array.isArray(times) ||
    !times.length ||
    !Array.isArray(markers) ||
    !markers.length
  ) {
    return;
  }

  const numericTimes =
    times.filter(
      value =>
        typeof value === "number" &&
        Number.isFinite(value)
    );

  if (!numericTimes.length) {
    return;
  }

  const start = numericTimes[0];
  const end =
    numericTimes.at(-1);
  const span = end - start;

  if (!(span > 0)) {
    return;
  }

  for (const marker of markers) {
    const onset =
      Number(marker.onset);

    if (
      !Number.isFinite(onset) ||
      onset < start ||
      onset > end
    ) {
      continue;
    }

    const x =
      ((onset - start) / span) *
      width;

    if (
      "strokeStyle" in context
    ) {
      context.strokeStyle =
        "rgba(30, 41, 59, 0.32)";
    }

    if (
      typeof context.setLineDash ===
      "function"
    ) {
      context.setLineDash([4, 4]);
    }

    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();

    if (
      typeof context.setLineDash ===
      "function"
    ) {
      context.setLineDash([]);
    }
  }
}

/**
 * Render raw optical Red and IR/NIR traces.
 * Values stay in device units; no haemoglobin conversion is performed here.
 */
export function renderTrace(
  canvas,
  traces,
  options = {}
) {
  if (!canvas) return;

  const context =
    canvas.getContext("2d");

  if (!context) return;

  const width =
    canvas.width;

  const height =
    canvas.height;

  context.clearRect(
    0,
    0,
    width,
    height
  );

  const range =
    collectRange(traces);

  if (!range) {
    return;
  }

  drawLine(
    context,
    traces.red ?? [],
    width,
    height,
    range,
    options.redColor ??
      "#dc2626"
  );

  drawLine(
    context,
    traces.infrared ?? [],
    width,
    height,
    range,
    options.infraredColor ??
      "#2563eb"
  );

  drawMarkers(
    context,
    width,
    height,
    traces.times ?? [],
    options.markers ?? []
  );
}
