const VALID_TYPES = new Set([
  "baseline",
  "task",
  "rest",
  "custom"
]);

function normalizeName(value, index) {
  const name = String(value ?? "").trim();
  return name || `Phase ${index + 1}`;
}

export function protocolMarkerLabel(phaseName, boundary) {
  const clean = String(phaseName)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${clean}_${String(boundary).toUpperCase()}`;
}

export function normalizeProtocol(input = {}) {
  const phases = Array.isArray(input.phases)
    ? input.phases
    : [];

  if (!phases.length) {
    throw new Error(
      "Protocol requires at least one phase."
    );
  }

  const normalizedPhases = phases.map(
    (phase, index) => {
      const durationSeconds =
        Number(phase.durationSeconds);

      if (
        !Number.isFinite(durationSeconds) ||
        durationSeconds <= 0
      ) {
        throw new Error(
          `Phase ${index + 1} durationSeconds must be greater than zero.`
        );
      }

      const type = String(
        phase.type ?? "custom"
      ).toLowerCase();

      if (!VALID_TYPES.has(type)) {
        throw new Error(
          `Phase ${index + 1} has unsupported type "${type}".`
        );
      }

      return {
        id: String(
          phase.id ?? `phase-${index + 1}`
        ),
        name: normalizeName(
          phase.name,
          index
        ),
        type,
        durationSeconds,
        autoMarkerEnabled:
          phase.autoMarkerEnabled !== false
      };
    }
  );

  const repeatCount = Math.max(
    1,
    Math.floor(
      Number(input.repeatCount) || 1
    )
  );

  return {
    repeatCount,
    phases: normalizedPhases
  };
}

export function buildProtocolTimeline(protocolInput) {
  const protocol =
    normalizeProtocol(protocolInput);

  const timeline = [];
  let cursor = 0;

  for (
    let cycle = 1;
    cycle <= protocol.repeatCount;
    cycle += 1
  ) {
    protocol.phases.forEach(
      (phase, phaseIndex) => {
        const startSeconds = cursor;

        const endSeconds =
          startSeconds +
          phase.durationSeconds;

        timeline.push({
          phase: structuredClone(phase),
          cycle,
          phaseIndex,
          startSeconds,
          endSeconds
        });

        cursor = endSeconds;
      }
    );
  }

  return timeline;
}
