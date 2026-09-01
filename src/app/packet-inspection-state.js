export function createPacketInspectionState(inspector) {
  const buildState = () => {
    const summary = inspector.getSummary();

    let packetRateHz = 0;

    if (summary.intervalsMs.length > 0) {
      const totalIntervalMs = summary.intervalsMs.reduce(
        (sum, interval) => sum + interval,
        0
      );

      if (totalIntervalMs > 0) {
        packetRateHz =
          (summary.intervalsMs.length * 1000) / totalIntervalMs;
      }
    }

    return {
      totalPackets: summary.totalPackets,
      byCharacteristic: {
        ABB1: summary.byCharacteristic.ABB1 ?? 0,
        ABB4: summary.byCharacteristic.ABB4 ?? 0,
        ABB5: summary.byCharacteristic.ABB5 ?? 0,
        unknown: summary.byCharacteristic.unknown ?? 0
      },
      packetLengths: {
        ABB1: [...(summary.packetLengths?.ABB1 ?? [])],
        ABB4: [...(summary.packetLengths?.ABB4 ?? [])],
        ABB5: [...(summary.packetLengths?.ABB5 ?? [])],
        unknown: [...(summary.packetLengths?.unknown ?? [])]
      },
      intervalsMs: [...summary.intervalsMs],
      packetRateHz
    };
  };

  const state = buildState();

  Object.defineProperty(state, "get", {
    enumerable: false,
    value: () => {
      const current = buildState();

      return {
        totalPackets: current.totalPackets,
        byCharacteristic: {
          ABB1: current.byCharacteristic.ABB1,
          ABB4: current.byCharacteristic.ABB4,
          ABB5: current.byCharacteristic.ABB5,
          unknown: current.byCharacteristic.unknown
        },
        packetRateHz: current.packetRateHz
      };
    }
  });

  return state;
}