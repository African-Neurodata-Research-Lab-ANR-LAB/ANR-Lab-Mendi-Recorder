export class HbDualChannelRenderer {
  constructor({ leftCanvas, rightCanvas, maxPoints = 300 } = {}) {
    this.leftCanvas = leftCanvas;
    this.rightCanvas = rightCanvas;
    this.maxPoints = maxPoints;

    this.history = {
      left: { hbo: [], hbr: [] },
      right: { hbo: [], hbr: [] }
    };
  }

  push(sample) {
    if (!sample) return;

    this.append(this.history.left, sample.left);
    this.append(this.history.right, sample.right);
    this.render();
  }

  append(channel, values = {}) {
    channel.hbo.push(Number(values.hbo ?? 0));
    channel.hbr.push(Number(values.hbr ?? 0));

    if (channel.hbo.length > this.maxPoints) channel.hbo.shift();
    if (channel.hbr.length > this.maxPoints) channel.hbr.shift();
  }

  render() {
    this.draw(this.leftCanvas, this.history.left, 'LEFT fNIRS — HbO / HbR');
    this.draw(this.rightCanvas, this.history.right, 'RIGHT fNIRS — HbO / HbR');
  }

  draw(canvas, data, title) {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.plot(ctx, data.hbo, canvas.width, canvas.height);
    this.plot(ctx, data.hbr, canvas.width, canvas.height);
  }

  plot(ctx, values, width, height) {
    if (values.length < 2) return;

    ctx.beginPath();
    values.forEach((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height / 2 - value * 15;
      index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}
