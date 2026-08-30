export function drawTechnicalTrace(canvas, values) {
  const ctx = canvas?.getContext?.("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!values?.length) return;

  const finite = values.filter(Number.isFinite);
  if (!finite.length) return;

  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const span = max - min || 1;

  ctx.beginPath();
  finite.forEach((value, index) => {
    const x = (index / Math.max(1, finite.length - 1)) * canvas.width;
    const y = canvas.height - ((value - min) / span) * canvas.height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
