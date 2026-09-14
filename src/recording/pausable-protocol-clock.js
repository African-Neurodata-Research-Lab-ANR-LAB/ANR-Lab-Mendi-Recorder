export class PausableProtocolClock {
  constructor({ sessionClock }) {
    this.sessionClock = sessionClock;

    this.started = false;
    this.paused = false;
    this.stopped = false;

    this.frozenProtocolSeconds = 0;

    this.segments = [];
  }

  start({
    sessionStartSeconds = 0
  } = {}) {
    this.started = true;
    this.paused = false;
    this.stopped = false;

    this.frozenProtocolSeconds = 0;

    this.segments = [
      {
        protocolStart: 0,
        sessionStart: sessionStartSeconds,
        protocolEnd: null,
        sessionEnd: null
      }
    ];
  }

  nowSeconds() {
    if (!this.started) {
      return 0;
    }

    if (
      this.paused ||
      this.stopped
    ) {
      return this.frozenProtocolSeconds;
    }

    const segment =
      this.segments.at(-1);

    return (
      segment.protocolStart +
      Math.max(
        0,
        this.sessionClock.nowSeconds() -
          segment.sessionStart
      )
    );
  }

  pause() {
    if (
      !this.started ||
      this.paused ||
      this.stopped
    ) {
      return;
    }

    const protocolNow =
      this.nowSeconds();

    const sessionNow =
      this.sessionClock.nowSeconds();

    const segment =
      this.segments.at(-1);

    segment.protocolEnd =
      protocolNow;

    segment.sessionEnd =
      sessionNow;

    this.frozenProtocolSeconds =
      protocolNow;

    this.paused = true;
  }

  resume() {
    if (
      !this.started ||
      !this.paused ||
      this.stopped
    ) {
      return;
    }

    this.segments.push({
      protocolStart:
        this.frozenProtocolSeconds,
      sessionStart:
        this.sessionClock.nowSeconds(),
      protocolEnd: null,
      sessionEnd: null
    });

    this.paused = false;
  }

  stop() {
    if (
      !this.started ||
      this.stopped
    ) {
      return;
    }

    if (!this.paused) {
      this.frozenProtocolSeconds =
        this.nowSeconds();

      const segment =
        this.segments.at(-1);

      segment.protocolEnd =
        this.frozenProtocolSeconds;

      segment.sessionEnd =
        this.sessionClock.nowSeconds();
    }

    this.stopped = true;
    this.paused = false;
  }

  protocolToSessionSeconds(
    protocolSeconds
  ) {
    const target =
      Number(protocolSeconds);

    const matchingSegments =
      this.segments.filter(
        segment =>
          target >=
            segment.protocolStart &&
          (
            segment.protocolEnd ===
              null ||
            target <=
              segment.protocolEnd
          )
      );

    const segment =
      matchingSegments.at(-1);

    if (!segment) {
      throw new Error(
        `No Session Clock mapping for protocol time ${target}.`
      );
    }

    return (
      segment.sessionStart +
      (
        target -
        segment.protocolStart
      )
    );
  }

  getState() {
    return {
      started: this.started,
      paused: this.paused,
      stopped: this.stopped,
      protocolSeconds:
        this.nowSeconds(),
      sessionSeconds:
        this.sessionClock.nowSeconds(),
      segments:
        structuredClone(this.segments)
    };
  }
}
