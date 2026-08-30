export function decodeCalibration(bytes) {
  return {
    rawBytes: Array.from(Uint8Array.from(bytes)),
    leftOffset: null,
    rightOffset: null,
    pulseOffset: null,
    autoCalibration: null,
    lowPower: null,
    decoded: false
  };
}
