export function createPacketInspectionState(inspector) {
  const summary = inspector.getSummary();

  return {
    totalPackets: summary.totalPackets,
    byCharacteristic: { ...summary.byCharacteristic },
    packetLengths: {
      ...summary.packetLengths
    },
    intervalsMs: [...summary.intervalsMs]
  };
}
