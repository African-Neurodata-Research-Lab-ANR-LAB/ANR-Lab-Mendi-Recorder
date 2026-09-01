const initialMonitorState = Object.freeze({
  elapsedSeconds: 0,
  packetRateHz: 0,
  signalQuality: "NO SIGNAL",
  contact: {
    left: "unknown",
    right: "unknown"
  },
  channels: {
    ABB1: 0,
    ABB4: 0,
    ABB5: 0,
    unknown: 0
  },
  imu: {
    enabled: true,
    status: "NOT AVAILABLE"
  },
  automarker: {
    enabled: true,
    lastEvent: null
  }
});

const initialPacketInspectionState = Object.freeze({
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
});
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
  error: null,
  monitor: initialMonitorState,
  packetInspection: initialPacketInspectionState
});
export function createState() {
  return {
    ...initialState,
    markers: [],
    monitor: {
      ...initialMonitorState,
      contact: {
        ...initialMonitorState.contact
      },
      channels: {
        ...initialMonitorState.channels
      },
      imu: {
        ...initialMonitorState.imu
      },
            automarker: {
        ...initialMonitorState.automarker
      }
    },
    packetInspection: {
      ...initialPacketInspectionState,
      byCharacteristic: {
        ...initialPacketInspectionState.byCharacteristic
      },
      packetLengths: {
        ABB1: [],
        ABB4: [],
        ABB5: [],
        unknown: []
      },
      intervalsMs: []
    }
  };
}