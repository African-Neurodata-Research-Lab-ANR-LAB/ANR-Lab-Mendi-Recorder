import {
  buildProtocolTimeline,
  protocolMarkerLabel
} from "./protocol-model.js";

function makeBoundary(entry, boundary) {
  const isStart = boundary === "start";

  return {
    atSeconds: isStart
      ? entry.startSeconds
      : entry.endSeconds,
    priority: isStart ? 1 : 0,
    phase: entry.phase,
    cycle: entry.cycle,
    boundary
  };
}

export class ProtocolRunner {
  constructor({ clock, addMarker }) {
    this.clock = clock;
    this.addMarker = addMarker;

    this.timeline = [];
    this.boundaries = [];
    this.nextBoundaryIndex = 0;
    this.active = false;

    this.state = {
      active: false,
      phaseName: null,
      phaseType: null,
      cycle: null,
      phaseElapsedSeconds: 0,
      phaseRemainingSeconds: 0,
      nextPhaseName: null,
      totalDurationSeconds: 0,
      completed: false
    };
  }

  start(protocol) {
    this.stop();

    this.timeline =
      buildProtocolTimeline(protocol);

    this.boundaries = this.timeline
      .flatMap(entry => [
        makeBoundary(entry, "start"),
        makeBoundary(entry, "end")
      ])
      .sort(
        (a, b) =>
          a.atSeconds - b.atSeconds ||
          a.priority - b.priority
      );

    this.nextBoundaryIndex = 0;
    this.active = true;

    const totalDurationSeconds =
      this.timeline.at(-1)?.endSeconds ?? 0;

    this.state = {
      active: true,
      phaseName: null,
      phaseType: null,
      cycle: null,
      phaseElapsedSeconds: 0,
      phaseRemainingSeconds: 0,
      nextPhaseName: null,
      totalDurationSeconds,
      completed: false
    };
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
      this.nextBoundaryIndex <
        this.boundaries.length &&
      this.boundaries[
        this.nextBoundaryIndex
      ].atSeconds <= now
    ) {
      const boundary =
        this.boundaries[
          this.nextBoundaryIndex
        ];

      const label =
        protocolMarkerLabel(
          boundary.phase.name,
          boundary.boundary
        );

      this.addMarker({
        onset: boundary.atSeconds,
        duration: 0,
        trialType: boundary.phase.type,
        markerType: "phase_boundary",
        phase: boundary.phase.name,
        cycle: boundary.cycle,
        description: label,
        source: "protocol"
      });

      this.nextBoundaryIndex += 1;
    }

    this.updateState(now);

    return this.getState();
  }

  updateState(now) {
    const entry =
      this.getContextAt(now);

    if (!entry) {
      const total =
        this.state.totalDurationSeconds;

      if (now >= total) {
        this.active = false;

        this.state = {
          ...this.state,
          active: false,
          completed: true,
          phaseName: null,
          phaseType: null,
          cycle: null,
          phaseElapsedSeconds: 0,
          phaseRemainingSeconds: 0,
          nextPhaseName: null
        };
      }

      return;
    }

    const index =
      this.timeline.indexOf(entry);

    const next =
      this.timeline[index + 1] ?? null;

    this.state = {
      ...this.state,
      active: true,
      completed: false,
      phaseName: entry.phase.name,
      phaseType: entry.phase.type,
      cycle: entry.cycle,
      phaseElapsedSeconds:
        Math.max(
          0,
          now - entry.startSeconds
        ),
      phaseRemainingSeconds:
        Math.max(
          0,
          entry.endSeconds - now
        ),
      nextPhaseName:
        next?.phase.name ?? null
    };
  }

  getContextAt(timeSeconds) {
    return (
      this.timeline.find(
        entry =>
          timeSeconds >=
            entry.startSeconds &&
          timeSeconds <
            entry.endSeconds
      ) ?? null
    );
  }

  getState() {
    return structuredClone(this.state);
  }

  stop() {
    this.active = false;
  }
}
