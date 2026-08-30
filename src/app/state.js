export const initialState = Object.freeze({
  browserSupport: "unknown",
  connection: "disconnected",
  recording: "idle",
  device: null,
  battery: null,
  packetCount: 0,
  quality: "NO SIGNAL",
  markers: [],
  recoveryAvailable: false,
  error: null
});

export function createState() {
  return {
    ...initialState,
    markers: []
  };
}
