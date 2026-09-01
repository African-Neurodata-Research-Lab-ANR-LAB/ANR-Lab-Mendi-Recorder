export const initialState = Object.freeze({
  browserSupport: "unknown",
  connection: "disconnected",
  recording: "idle",
  device: null,
  battery: null,
  packetCount: 0,
  quality: "NO SIGNAL",
  packetInspection: {
    totalPackets: 0,
    byCharacteristic: {
      ABB1: 0,
      ABB4: 0,
      ABB5: 0,
      unknown: 0
    },
    packetLengths: {
      ABB1: [],
      ABB4: [],
      ABB5: [],
      unknown: []
    },
    intervalsMs: []
  },
  markers: [],
  recoveryAvailable: false,
  error: null
});

export function createState() {
  return {
    ...initialState,
    packetInspection: {
      ...initialState.packetInspection,
      byCharacteristic: { ...initialState.packetInspection.byCharacteristic },
      packetLengths: {
        ABB1: [],
        ABB4: [],
        ABB5: [],
        unknown: []
      },
      intervalsMs: []
    },
    markers: []
  };
}
