function finiteOrNull(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  )
    ? value
    : null;
}

export class LiveTraceBuffer {
  constructor(limit = 500) {
    this.limit = limit;

    this.times = [];

    this.left = {
      red: [],
      infrared: []
    };

    this.right = {
      red: [],
      infrared: []
    };
  }

  push(sample, timeSeconds = null) {
    const legacy =
      sample?.left
        ? null
        : sample;

    const left =
      sample?.left ?? {
        red: legacy?.red,
        infrared:
          legacy?.infrared
      };

    const right =
      sample?.right ?? {};

    this.times.push(
      finiteOrNull(timeSeconds)
    );

    this.left.red.push(
      finiteOrNull(left?.red)
    );

    this.left.infrared.push(
      finiteOrNull(
        left?.infrared
      )
    );

    this.right.red.push(
      finiteOrNull(right?.red)
    );

    this.right.infrared.push(
      finiteOrNull(
        right?.infrared
      )
    );

    this.trim();
  }

  trim() {
    while (
      this.times.length > this.limit
    ) {
      this.times.shift();
      this.left.red.shift();
      this.left.infrared.shift();
      this.right.red.shift();
      this.right.infrared.shift();
    }
  }

  clear() {
    this.times.length = 0;
    this.left.red.length = 0;
    this.left.infrared.length = 0;
    this.right.red.length = 0;
    this.right.infrared.length = 0;
  }

  get() {
    return {
      red: [...this.left.red],
      infrared: [
        ...this.left.infrared
      ]
    };
  }

  getDual() {
    return {
      times: [...this.times],
      left: {
        red: [...this.left.red],
        infrared: [
          ...this.left.infrared
        ]
      },
      right: {
        red: [...this.right.red],
        infrared: [
          ...this.right.infrared
        ]
      }
    };
  }
}
