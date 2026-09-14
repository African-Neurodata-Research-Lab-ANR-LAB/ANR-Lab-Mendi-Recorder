import {
  ProtocolRunner
} from "./protocol-runner.js";

import {
  AutoMarkerScheduler
} from "./auto-marker.js";

import {
  PausableProtocolClock
} from "../recording/pausable-protocol-clock.js";

function eventPriority(event) {
  if (
    event.markerType === "phase_boundary" &&
    String(event.description).endsWith("_END")
  ) {
    return 0;
  }

  if (
    event.markerType === "phase_boundary" &&
    String(event.description).endsWith("_START")
  ) {
    return 1;
  }

  if (event.markerType === "auto_marker") {
    return 2;
  }

  return 3;
}

function compareEvents(a, b) {
  return (
    a.onset - b.onset ||
    eventPriority(a) - eventPriority(b)
  );
}

export class ExperimentEngine {
  constructor({
    session,
    protocolClock = null,
    pollMs = 100,
    setIntervalFn = globalThis.setInterval,
    clearIntervalFn = globalThis.clearInterval
  }) {
    this.session = session;
    this.pollMs = pollMs;
    this.setIntervalFn = setIntervalFn;
    this.clearIntervalFn = clearIntervalFn;

    this.timer = null;
    this.active = false;
    this.pendingEvents = [];

    this.protocolClock =
      protocolClock ??
      new PausableProtocolClock({
        sessionClock: this.session.clock
      });

    const bufferEvent = event => {
      const protocolTime = event.onset;

      const mappedEvent = {
        ...structuredClone(event),
        protocolTime,
        onset:
          this.protocolClock
            .protocolToSessionSeconds(
              protocolTime
            )
      };

      this.pendingEvents.push(
        mappedEvent
      );

      return mappedEvent;
    };

    this.protocol = new ProtocolRunner({
      clock: this.protocolClock,
      addMarker: bufferEvent
    });

    this.autoMarker =
      new AutoMarkerScheduler({
        clock: this.protocolClock,
        addMarker: bufferEvent,
        getContextAt: timeSeconds =>
          this.protocol.getContextAt(
            timeSeconds
          )
      });
  }

  start({
    protocol,
    autoMarkerIntervalSeconds = 0
  }) {
    this.stop();

    this.pendingEvents = [];

    this.protocolClock.start({
      sessionStartSeconds: 0
    });

    this.protocol.start(protocol);

    if (
      Number(autoMarkerIntervalSeconds) > 0
    ) {
      this.autoMarker.start({
        intervalSeconds: Number(
          autoMarkerIntervalSeconds
        )
      });
    }

    this.active = true;

    this.timer = this.setIntervalFn(
      () => this.tick(),
      this.pollMs
    );

    return this.getState();
  }

  tick() {
    if (!this.active) {
      return this.getState();
    }

    this.pendingEvents = [];

    const protocolState =
      this.protocol.tick();

    this.autoMarker.tick();

    this.flushPendingEvents();

    if (protocolState.completed) {
      this.stop();
    }

    return this.getState();
  }

  pause() {
    if (!this.active) {
      return this.getState();
    }

    this.protocolClock.pause();

    return this.getState();
  }

  resume() {
    if (!this.active) {
      return this.getState();
    }

    this.protocolClock.resume();

    return this.getState();
  }

  flushPendingEvents() {
    const events = this.pendingEvents
      .slice()
      .sort(compareEvents);

    this.pendingEvents = [];

    for (const event of events) {
      this.session.addMarkerAt(event);
    }
  }

  stop() {
    if (this.timer !== null) {
      this.clearIntervalFn(
        this.timer
      );
    }

    this.timer = null;

    if (this.protocol) {
      this.protocol.stop();
    }

    if (this.autoMarker) {
      this.autoMarker.stop();
    }

    if (this.protocolClock) {
      this.protocolClock.stop();
    }

    this.active = false;
  }

  getState() {
    return {
      active: this.active,
      protocol:
        this.protocol.getState(),
      autoMarker:
        this.autoMarker.getState(),
      protocolClock:
        this.protocolClock.getState()
    };
  }
}


