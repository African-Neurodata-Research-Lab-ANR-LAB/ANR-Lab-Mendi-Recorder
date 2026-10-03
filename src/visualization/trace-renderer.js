const finite = value => typeof value === 'number' && Number.isFinite(value);

function valueRange(traces) {
  let min = Infinity, max = -Infinity;
  for (const key of ['red', 'infrared']) {
    for (const value of traces[key] ?? []) {
      if (finite(value)) { min = Math.min(min, value); max = Math.max(max, value); }
    }
  }
  if (!finite(min)) return null;
  const pad = min === max ? Math.max(Math.abs(min) * 0.02, 1) : (max - min) * 0.08;
  return {min: min - pad, max: max + pad};
}

function dot(ctx, x, y, color) {
  ctx.fillStyle = color;
  if (typeof ctx.arc === 'function' && typeof ctx.fill === 'function') {
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 2 * Math.PI); ctx.fill();
  } else ctx.fillRect?.(x - 2, y - 2, 4, 4);
}

/** Raw values only. Sample and event x coordinates share a session-time axis. */
export function renderTrace(canvas, traces, options = {}) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const {width, height} = canvas;
  ctx.clearRect(0, 0, width, height);
  const times = traces.times ?? [];
  const validTimes = times.filter(finite);
  const start = options.startSeconds ?? validTimes[0];
  const end = options.endSeconds ?? validTimes.at(-1);
  const timed = finite(start) && finite(end) && end > start;
  const plotWidth = Math.max(1, width - 1);
  const xAt = (time, index, length) => timed && finite(time)
    ? (time - start) / (end - start) * plotWidth
    : length === 1 ? plotWidth / 2 : index / Math.max(1, length - 1) * plotWidth;
  const range = valueRange(traces);
  if (range) {
    for (const [key, color] of [['red', options.redColor ?? '#dc2626'], ['infrared', options.infraredColor ?? '#2563eb']]) {
      const samples = traces[key] ?? [];
      const valid = samples.map((value, index) => ({value, index}))
        .filter(p => finite(p.value) && (!timed || (finite(times[p.index]) && times[p.index] >= start && times[p.index] <= end)));
      if (!valid.length) continue;
      const yAt = value => height - 28 - (value - range.min) / (range.max - range.min) * Math.max(1, height - 48);
      if (valid.length === 1) {
        const p = valid[0]; dot(ctx, xAt(times[p.index], p.index, samples.length), yAt(p.value), color); continue;
      }
      ctx.strokeStyle = color; ctx.lineWidth = 1.7; ctx.beginPath();
      let previous = null;
      let segmentLength = 0;
      const isolated = [];
      for (const point of valid) {
        const x = xAt(times[point.index], point.index, samples.length);
        const y = yAt(point.value);
        const gap = previous && timed && times[point.index] - times[previous.index] > (options.gapSeconds ?? 2);
        if (!previous || point.index !== previous.index + 1 || gap) {
          if (segmentLength === 1) isolated.push(previous);
          ctx.moveTo(x, y);
          segmentLength = 1;
        } else {
          ctx.lineTo(x, y);
          segmentLength += 1;
        }
        previous = point;
      }
      ctx.stroke();
      if (segmentLength === 1) isolated.push(previous);
      for (const point of isolated) {
        dot(ctx, xAt(times[point.index], point.index, samples.length), yAt(point.value), color);
      }
    }
  }
  if (!timed) return;
  for (const marker of options.markers ?? []) {
    if (!finite(marker.onset) || marker.onset < start || marker.onset > end) continue;
    const x = xAt(marker.onset);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)'; ctx.lineWidth = 1;
    ctx.setLineDash?.([4, 4]); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height - 22); ctx.stroke(); ctx.setLineDash?.([]);
    ctx.fillStyle = '#334155'; ctx.font = '11px sans-serif';
    ctx.fillText?.(String(marker.description ?? '').slice(0, 24), Math.min(x + 3, Math.max(0, width - 150)), 13);
  }
  ctx.fillStyle = '#64748b'; ctx.font = '12px sans-serif';
  ctx.fillText?.(`${start.toFixed(1)} s`, 4, height - 5);
  ctx.fillText?.(`${end.toFixed(1)} s`, Math.max(4, width - 75), height - 5);
}
