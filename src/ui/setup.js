export function readSetupForm(form) {
  const data = new FormData(form);
  return {
    participantCode: String(data.get("participantCode") || "").trim(),
    sessionCode: String(data.get("sessionCode") || "").trim(),
    protocol: String(data.get("protocol") || "").trim(),
    notes: String(data.get("notes") || "").trim(),
    imuEnabled: data.get("imuEnabled") === "on"
  };
}

export function validateSetup(data) {
  const errors = [];
  if (!data.participantCode) errors.push("Participant Code is required.");
  if (!data.sessionCode) errors.push("Session Code is required.");
  if (!data.protocol) errors.push("Protocol is required.");

  for (const value of [data.participantCode, data.sessionCode]) {
    if (/[<>"'@]/.test(value)) errors.push("Use pseudonymous codes only; do not enter direct identifiers.");
  }

  return errors;
}
