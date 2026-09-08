export class LiveTraceBuffer {
  constructor(limit = 500) {
    this.limit = limit;
    this.red = [];
    this.infrared = [];
  }

  push(sample) {
    this.red.push(sample.red);
    this.infrared.push(sample.infrared);

    if (this.red.length > this.limit) {
      this.red.shift();
    }

    if (this.infrared.length > this.limit) {
      this.infrared.shift();
    }
  }

  get() {
    return {
      red: [...this.red],
      infrared: [...this.infrared]
    };
  }
}
