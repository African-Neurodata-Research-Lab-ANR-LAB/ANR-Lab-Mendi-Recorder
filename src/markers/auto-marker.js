export class AutoMarkerScheduler {
  constructor({
    clock,
    addMarker,
    getContextAt
  }) {
    this.clock = clock;
    this.addMarker = addMarker;
    this.getContextAt = getContextAt;

    this.active = false;
    this.intervalSeconds = 0;
    this.nextAtSeconds = null;
    this.emittedCount = 0;
  }

  start({ intervalSeconds }) {
    this.stop();

    const interval = Number(intervalSeconds);

    if (
      !Number.isFinite(interval) ||
      interval <= 0
    ) {
      return false;
    }

    this.active = true;
    this.intervalSeconds = interval;
    this.nextAtSeconds = interval;
    this.emittedCount = 0;

    return true;
  }

  tick() {
    if (!this.active) {
      return this.getState();
    }

    const now = Math.max(
      0,
      this.clock.nowSeconds()
    );

    while (
      this.nextAtSeconds !== null &&
      this.nextAtSeconds <= now
    ) {
      const eventTime =
        this.nextAtSeconds;

      const context =
        this.getContextAt(eventTime);

      if (
        context &&
        context.phase.autoMarkerEnabled !== false
      ) {
        this.emittedCount += 1;

        const number =
          String(this.emittedCount)
            .padStart(3, "0");

        this.addMarker({
          onset: eventTime,
          duration: 0,
          trialType:
            context.phase.type ??
            "auto_marker",
          markerType: "auto_marker",
          phase:
            context.phase.name ?? null,
          cycle:
            context.cycle ?? null,
          description:
            `AUTO_MARKER_${number}`,
          source: "auto_marker"
        });
      }

      this.nextAtSeconds +=
        this.intervalSeconds;
    }

    return this.getState();
  }

  stop() {
    this.active = false;
    this.nextAtSeconds = null;
  }

  getState() {
    return {
      active: this.active,
      intervalSeconds:
        this.intervalSeconds,
      nextAtSeconds:
        this.nextAtSeconds,
      emittedCount:
        this.emittedCount
    };
  }
}
