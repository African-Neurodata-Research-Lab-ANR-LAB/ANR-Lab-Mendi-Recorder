export function eventsTsv(events) {
  const rows = [["onset", "duration", "description", "source"]];
  for (const event of events) {
    rows.push([event.onset, event.duration, event.description, event.source]);
  }
  return rows.map(row => row.map(v => String(v ?? "").replaceAll("\t", " ")).join("\t")).join("\n") + "\n";
}
