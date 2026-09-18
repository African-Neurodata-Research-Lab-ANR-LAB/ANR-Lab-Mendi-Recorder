export class HbLivePanel {
  constructor({ canvas, stream }) {
    this.canvas = canvas;
    this.stream = stream;
    this.history = {
      hbo: [],
      hbr: []
    };
    this.unsubscribe = null;
  }

  start() {
    if (!this.stream || typeof this.stream.subscribe !== "function") {
      throw new Error("HbPreviewStream subscription is required");
    }

    this.unsubscribe = this.stream.subscribe((sample) => {
      if (typeof sample.hbo === "number") {
        this.history.hbo.push(sample.hbo);
      }

      if (typeof sample.hbr === "number") {
        this.history.hbr.push(sample.hbr);
      }

      this.render();
    });
  }

  render() {
    if (!this.canvas) return;

    const context = this.canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Preview renderer placeholder.
    // Final scientific visualization will use calibrated MBLL output.
    context.beginPath();

    const values = this.history.hbo.slice(-200);
    values.forEach((value, index) => {
      const x = index * (this.canvas.width / 200);
      const y = this.canvas.height / 2 - value;

      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });

    context.stroke();
  }

  stop() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}
