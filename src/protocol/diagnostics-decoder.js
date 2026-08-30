export function decodeDiagnostics(bytes) {
  return {
    rawBytes: Array.from(Uint8Array.from(bytes)),
    adc: null,
    imuOk: null,
    sensorOk: null,
    decoded: false
  };
}
