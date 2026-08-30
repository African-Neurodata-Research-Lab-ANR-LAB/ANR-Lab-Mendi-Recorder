export function evaluatePacket(packet) {
  const bytes = packet?.bytes ?? [];
  return {
    valid: Array.isArray(bytes) && bytes.length > 0,
    length: bytes.length
  };
}
