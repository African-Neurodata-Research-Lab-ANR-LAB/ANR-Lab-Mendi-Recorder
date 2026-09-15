const initialMonitorState =
  Object.freeze({
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
      enabled: false,
      active: false,
      intervalSeconds: null,
      nextAtSeconds: null,
      lastEvent: null
    }
  });

const emptyOpticalChannel = () => ({
  red: null,
  infrared: null,
  ambient: null
});

const initialSensorState =
  Object.freeze({
    decodedFrameCount: 0,
    temperatureC: null,
    left: emptyOpticalChannel(),
    right: emptyOpticalChannel(),
    pulseReference:
      emptyOpticalChannel(),
    imu: {
      accX: null,
      accY: null,
      accZ: null,
      gyroX: null,
      gyroY: null,
      gyroZ: null
    }
  });

const initialExperimentState =
  Object.freeze({
    sessionSeconds: 0,
    protocolSeconds: 0,
    phaseName: null,
    phaseType: null,
    phaseElapsedSeconds: 0,
    phaseRemainingSeconds: 0,
    cycle: null,
    totalCycles: null,
    nextPhaseName: null,
    progress: 0
  });

const initialPacketInspectionState =
  Object.freeze({
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

export const initialState =
  Object.freeze({
    browserSupport: "unknown",
    connection: "disconnected",
    recording: "idle",
    sessionStatus: "idle",
    device: null,
    battery: null,
    packetCount: 0,
    quality: "NO SIGNAL",
    markers: [],
    recoveryAvailable: false,
    error: null,
    monitor: initialMonitorState,
    sensor: initialSensorState,
    experiment:
      initialExperimentState,
    packetInspection:
      initialPacketInspectionState
  });

export function createState() {
  return {
    ...initialState,
    markers: [],
    experiment: {
      ...initialExperimentState
    },
    sensor: {
      ...initialSensorState,
      left: emptyOpticalChannel(),
      right: emptyOpticalChannel(),
      pulseReference:
        emptyOpticalChannel(),
      imu: {
        ...initialSensorState.imu
      }
    },
    monitor: {
      ...initialMonitorState,
      contact: {
        ...initialMonitorState
          .contact
      },
      channels: {
        ...initialMonitorState
          .channels
      },
      imu: {
        ...initialMonitorState.imu
      },
      automarker: {
        ...initialMonitorState
          .automarker
      }
    },
    packetInspection: {
      ...initialPacketInspectionState,
      byCharacteristic: {
        ...initialPacketInspectionState
          .byCharacteristic
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

export function buildExperimentStartConfig(
  preparedSetup
) {
  return {
    protocol:
      preparedSetup.protocol,
    autoMarkerIntervalSeconds:
      preparedSetup.autoMarker
        ?.enabled === true
        ? Number(
            preparedSetup
              .autoMarker
              .intervalSeconds
          )
        : 0
  };
}

export function syncExperimentState(
  state,
  engineState,
  preparedSetup
) {
  const protocol =
    engineState?.protocol ?? {};

  const protocolClock =
    engineState?.protocolClock ?? {};

  const phaseElapsed =
    Number(
      protocol.phaseElapsedSeconds
    ) || 0;

  const phaseRemaining =
    Number(
      protocol.phaseRemainingSeconds
    ) || 0;

  const totalDuration =
    Number(
      protocol.totalDurationSeconds
    ) || 0;

  const protocolSeconds =
    Number(
      protocolClock.protocolSeconds
    ) || 0;

  state.experiment = {
    ...state.experiment,
    sessionSeconds:
      Number(
        protocolClock.sessionSeconds
      ) || 0,
    protocolSeconds,
    phaseName:
      protocol.phaseName ?? null,
    phaseType:
      protocol.phaseType ?? null,
    phaseElapsedSeconds:
      phaseElapsed,
    phaseRemainingSeconds:
      phaseRemaining,
    cycle:
      protocol.cycle ?? null,
    totalCycles:
      preparedSetup?.protocol
        ?.repeatCount ?? null,
    nextPhaseName:
      protocol.nextPhaseName ?? null,
    progress:
      totalDuration > 0
        ? Math.min(
            1,
            Math.max(
              0,
              protocolSeconds /
                totalDuration
            )
          )
        : 0
  };

  const autoMarker =
    engineState?.autoMarker;

  if (autoMarker) {
    state.monitor.automarker = {
      ...state.monitor.automarker,
      enabled:
        Number(
          autoMarker.intervalSeconds
        ) > 0,
      active:
        autoMarker.active === true,
      intervalSeconds:
        autoMarker.intervalSeconds ??
        null,
      nextAtSeconds:
        autoMarker.nextAtSeconds ??
        null
    };
  }

  return state.experiment;
}
