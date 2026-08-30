export function decodeFrame(bytes) {
  const raw = Uint8Array.from(bytes);
  return {
    rawBytes: Array.from(raw),
    // Field mapping remains deliberately explicit and validation-gated.
    // Unknown packet layouts are preserved rather than guessed.
    left: { red: null, ir: null, ambient: null },
    right: { red: null, ir: null, ambient: null },
    pulseReference: { red: null, ir: null, ambient: null },
    imu: { accX: null, accY: null, accZ: null, gyroX: null, gyroY: null, gyroZ: null },
    temperature: null,
    decoded: false
  };
}
