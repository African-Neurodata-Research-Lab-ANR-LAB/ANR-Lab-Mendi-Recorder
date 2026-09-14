import { normalizeProtocol } from "../markers/protocol-model.js";

export function readSetupForm(form) {
  const data = new FormData(form);

  const phaseRows = Array.from(
    form.querySelectorAll(
      "[data-protocol-phase]"
    )
  );

  const protocol =
    phaseRows.length > 0
      ? {
          repeatCount: Math.max(
            1,
            Math.floor(
              Number(
                data.get("repeatCount")
              ) || 1
            )
          ),
          phases: phaseRows.map(
            (row, index) => ({
              id:
                row.dataset.phaseId ||
                `phase-${index + 1}`,
              name: String(
                row.querySelector(
                  "[data-phase-name]"
                )?.value ?? ""
              ).trim(),
              type: String(
                row.querySelector(
                  "[data-phase-type]"
                )?.value ?? "custom"
              ).trim(),
              durationSeconds: Number(
                row.querySelector(
                  "[data-phase-duration]"
                )?.value
              ),
              autoMarkerEnabled:
                row.querySelector(
                  "[data-phase-automarker]"
                )?.checked === true
            })
          )
        }
      : String(
          data.get("protocol") || ""
        ).trim();

  return {
    participantCode: String(
      data.get("participantCode") || ""
    ).trim(),

    sessionCode: String(
      data.get("sessionCode") || ""
    ).trim(),

    protocol,

    autoMarker: {
      enabled:
        data.get("autoMarkerEnabled") ===
        "on",
      intervalSeconds: Number(
        data.get(
          "autoMarkerIntervalSeconds"
        ) || 0
      )
    },

    notes: String(
      data.get("notes") || ""
    ).trim(),

    imuEnabled:
      data.get("imuEnabled") === "on"
  };
}

export function validateSetup(data) {
  const errors = [];

  if (!data.participantCode) {
    errors.push(
      "Participant Code is required."
    );
  }

  if (!data.sessionCode) {
    errors.push(
      "Session Code is required."
    );
  }

  if (!data.protocol) {
    errors.push(
      "Protocol is required."
    );
  } else if (
    typeof data.protocol === "object"
  ) {
    try {
      normalizeProtocol(
        data.protocol
      );
    } catch (error) {
      errors.push(
        error.message
      );
    }
  }

  for (
    const value of [
      data.participantCode,
      data.sessionCode
    ]
  ) {
    if (/[<>"'@]/.test(value)) {
      errors.push(
        "Use pseudonymous codes only; do not enter direct identifiers."
      );
    }
  }

  return errors;
}

