function clean(value) {
  return String(value ?? "")
    .replaceAll("\t", " ")
    .replaceAll("\n", " ");
}

export function eventsTsv(events) {
  const rows = [[
    "onset",
    "protocol_time",
    "duration",
    "trial_type",
    "marker_type",
    "phase",
    "cycle",
    "description",
    "source"
  ]];

  for (const event of events) {
    rows.push([
      event.onset,
      event.protocolTime ?? "",
      event.duration ?? 0,
      event.trialType ??
        event.description ??
        "",
      event.markerType ??
        event.source ??
        "",
      event.phase ?? "",
      event.cycle ?? "",
      event.description ?? "",
      event.source ?? ""
    ]);
  }

  return (
    rows
      .map(row =>
        row
          .map(clean)
          .join("\t")
      )
      .join("\n") +
    "\n"
  );
}
