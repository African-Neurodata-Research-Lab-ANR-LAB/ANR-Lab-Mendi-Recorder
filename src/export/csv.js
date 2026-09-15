function escapeCsv(value) {
  const text =
    value == null
      ? ""
      : String(value);

  return /[",\n]/.test(text)
    ? `"${text.replaceAll(
        '"',
        '""'
      )}"`
    : text;
}

function makeCsv(rows) {
  return (
    rows
      .map(
        row =>
          row
            .map(escapeCsv)
            .join(",")
      )
      .join("\n") + "\n"
  );
}

export function rawPacketsCsv(
  packets
) {
  const rows = [
    [
      "timestamp_ms",
      "time_s",
      "characteristic_uuid",
      "bytes"
    ]
  ];

  for (const packet of packets) {
    rows.push([
      packet.timestampMs,
      packet.timeS,
      packet.characteristicUuid,
      Array.from(
        packet.bytes ?? []
      ).join(" ")
    ]);
  }

  return makeCsv(rows);
}

/**
 * Research-ready flat table of validated Mendi ABB1 decoded fields.
 * Optical values are raw device units; no HbO/HbR transformation occurs here.
 */
export function decodedOpticalCsv(
  samples
) {
  const rows = [
    [
      "time_s",
      "temperature_c",
      "left_red_raw",
      "left_ir_raw",
      "left_ambient_raw",
      "right_red_raw",
      "right_ir_raw",
      "right_ambient_raw",
      "pulse_red_raw",
      "pulse_ir_raw",
      "pulse_ambient_raw",
      "acc_x",
      "acc_y",
      "acc_z",
      "gyro_x",
      "gyro_y",
      "gyro_z"
    ]
  ];

  for (const sample of samples) {
    rows.push([
      sample.timeS,
      sample.temperature,
      sample.left?.red,
      sample.left?.ir,
      sample.left?.ambient,
      sample.right?.red,
      sample.right?.ir,
      sample.right?.ambient,
      sample.pulseReference?.red,
      sample.pulseReference?.ir,
      sample.pulseReference?.ambient,
      sample.imu?.accX,
      sample.imu?.accY,
      sample.imu?.accZ,
      sample.imu?.gyroX,
      sample.imu?.gyroY,
      sample.imu?.gyroZ
    ]);
  }

  return makeCsv(rows);
}
