export function decodeAdc(bytes) {
  return {
    rawBytes: Array.from(Uint8Array.from(bytes)),
    voltage: null,
    charging: null,
    usb: null,
    decoded: false
  };
}
