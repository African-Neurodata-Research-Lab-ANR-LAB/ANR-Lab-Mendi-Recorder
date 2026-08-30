function escapeCsv(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function rawPacketsCsv(packets) {
  const rows = [
    ["timestamp_ms", "time_s", "characteristic_uuid", "bytes"]
  ];

  for (const packet of packets) {
    rows.push([
      packet.timestampMs,
      packet.timeS,
      packet.characteristicUuid,
      packet.bytes.join(" ")
    ]);
  }

  return rows.map(row => row.map(escapeCsv).join(",")).join("\n") + "\n";
}
