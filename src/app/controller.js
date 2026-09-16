import {
  createState,
  syncExperimentState
} from "./state.js";

import {
  beginPreparedRecording,
  completePreparedExperiment,
  refreshPreparedRecording,
  requestProtocolCompletion,
  pausePreparedRecordingOnDisconnect,
  resumePreparedRecordingAfterReconnect,
  abortPreparedExperiment
} from "./experiment-start.js";

import {
  startAcquisition,
  stopAcquisition,
  handleAcquisitionDisconnect,
  reconnectAcquisition
} from "./acquisition.js";

import {
  MendiDriver
} from "../ble/mendi-driver.js";

import {
  PacketInspector
} from "../ble/packet-inspector.js";

import {
  Session
} from "../recording/session.js";

import {
  CheckpointStore
} from "../recording/checkpoint-store.js";

import {
  decodeFrame
} from "../protocol/frame-decoder.js";

import {
  decodeAdc
} from "../protocol/adc-decoder.js";

import {
  isMendiCharacteristic
} from "../ble/characteristic-utils.js";

import {
  rawPacketsCsv,
  decodedOpticalCsv
} from "../export/csv.js";

import {
  eventsTsv
} from "../export/tsv.js";

import {
  buildMetadata
} from "../export/metadata.js";

import {
  createSnirf
} from "../export/snirf.js";

import {
  mountRecorder,
  setProtocolBuilderLocked
} from "../ui/recorder.js";

import {
  readSetupForm,
  validateSetup
} from "../ui/setup.js";

import {
  renderDashboard
} from "../visualization/dashboard.js";

import {
  createPacketInspectionState
} from "./packet-inspection-state.js";

import {
  LiveTraceBuffer
} from "../visualization/live-trace-buffer.js";

import {
  extractOpticalChannels
} from "../protocol/optical-extractor.js";

import {
  renderTrace
} from "../visualization/trace-renderer.js";

const root =
  document.querySelector("#app");

mountRecorder(root);

const state = createState();
const driver = new MendiDriver();
const checkpoint =
  new CheckpointStore();
const packetInspector =
  new PacketInspector();
const packetInspectionState =
  createPacketInspectionState(
    packetInspector
  );
const traceBuffer =
  new LiveTraceBuffer(600);

let session = new Session();
let experimentEngine = null;
let preparedMetadata = null;
let acquisitionPacketHandler = null;
let monitorTimer = null;
let lastCheckpointAtMs = 0;

state.browserSupport =
  navigator.bluetooth
    ? "supported"
    : "unsupported";

function resetLiveState() {
  traceBuffer.clear();
  packetInspector.clear();

  state.packetCount = 0;
  state.quality = "NO SIGNAL";
  state.battery = null;

  state.sensor = {
    decodedFrameCount: 0,
    acquisitionMode: "WAITING",
    temperatureC: null,
    left: {
      red: null,
      infrared: null,
      ambient: null
    },
    right: {
      red: null,
      infrared: null,
      ambient: null
    },
    pulseReference: {
      red: null,
      infrared: null,
      ambient: null
    },
    imu: {
      accX: null,
      accY: null,
      accZ: null,
      gyroX: null,
      gyroY: null,
      gyroZ: null
    }
  };

  state.monitor.channels = {
    ABB1: 0,
    ABB4: 0,
    ABB5: 0,
    unknown: 0
  };

  state.monitor.packetRateHz = 0;
  state.monitor.signalQuality =
    "NO SIGNAL";
  state.monitor.elapsedSeconds = 0;

  lastCheckpointAtMs = 0;
}

function saveCheckpoint(
  force = false
) {
  if (
    session.status !== "recording" &&
    force !== true
  ) {
    return;
  }

  const now = Date.now();

  if (
    !force &&
    now - lastCheckpointAtMs < 2000
  ) {
    return;
  }

  try {
    checkpoint.save(
      session.snapshot()
    );

    lastCheckpointAtMs = now;
    state.recoveryAvailable = true;
  } catch (error) {
    // Acquisition must continue even if browser-local recovery storage is full.
    state.error =
      `Recovery checkpoint warning: ${error.message}`;
  }
}

function startMonitorTimer() {
  if (monitorTimer) return;

  monitorTimer = setInterval(
    () => {
      if (
        state.recording !==
        "recording"
      ) {
        return;
      }

      const completed =
        refreshPreparedRecording({
          experimentEngine,
          state,
          preparedSetup:
            preparedMetadata
        });

      state.monitor.elapsedSeconds =
        Math.floor(
          state.experiment
            .sessionSeconds
        );

      requestProtocolCompletion({
        completed,
        state,
        stopAction: () =>
          root
            .querySelector("#stop")
            ?.click()
      });

      saveCheckpoint();
      render();
    },
    250
  );
}

function stopMonitorTimer() {
  if (monitorTimer) {
    clearInterval(monitorTimer);
    monitorTimer = null;
  }
}

function updateTechnicalMonitor() {
  const inspection =
    packetInspectionState.get();

  state.packetInspection =
    inspection;

  state.monitor.packetRateHz =
    Number(
      inspection.packetRateHz
        .toFixed(2)
    );

  state.monitor.channels = {
    ABB1:
      inspection.byCharacteristic
        .ABB1,
    ABB4:
      inspection.byCharacteristic
        .ABB4,
    ABB5:
      inspection.byCharacteristic
        .ABB5,
    unknown:
      inspection.byCharacteristic
        .unknown
  };

  state.monitor.signalQuality =
    state.sensor
      .decodedFrameCount > 0
      ? "REVIEW"
      : state.packetCount > 0
        ? "REVIEW"
        : "NO SIGNAL";

  state.quality =
    state.monitor.signalQuality;
}

function renderLiveTraces() {
  const traces =
    traceBuffer.getDual();

  const markers =
    session.markers.all();

  const leftCanvas =
    root.querySelector("#trace");

  const rightCanvas =
    root.querySelector(
      "#trace-right"
    );

  if (leftCanvas) {
    renderTrace(
      leftCanvas,
      {
        ...traces.left,
        times: traces.times
      },
      { markers }
    );
  }

  if (rightCanvas) {
    renderTrace(
      rightCanvas,
      {
        ...traces.right,
        times: traces.times
      },
      { markers }
    );
  }
}

function render() {
  const recentMarkers =
    session.markers.all();

  const latestMarker =
    recentMarkers.at(-1);

  if (latestMarker) {
    state.monitor.automarker
      .lastEvent =
      latestMarker.description;
  }

  renderDashboard(root, state);
  renderLiveTraces();

  const markerList =
    root.querySelector("#markers");

  if (!markerList) return;

  markerList.innerHTML = "";

  for (
    const marker of
    recentMarkers
      .slice(-12)
      .reverse()
  ) {
    const item =
      document.createElement("li");

    const onset =
      Number(marker.onset);

    const time =
      Number.isFinite(onset)
        ? onset.toFixed(3)
        : marker.onset;

    item.textContent =
      `${time}s | ${marker.description}`;

    markerList.appendChild(item);
  }
}

root
  .querySelector("#setup-form")
  .addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const data =
        readSetupForm(
          event.currentTarget
        );

      const errors =
        validateSetup(data);

      if (errors.length) {
        state.error =
          errors.join(" ");

        alert(state.error);
        return;
      }

      preparedMetadata = data;
      state.sessionStatus =
        "prepared";

      state.monitor.imu = {
        enabled:
          data.imuEnabled === true,
        status:
          data.imuEnabled === true
            ? "WAITING"
            : "DISABLED"
      };

      state.monitor.automarker = {
        ...state.monitor.automarker,
        enabled:
          data.autoMarker
            ?.enabled === true,
        intervalSeconds:
          data.autoMarker
            ?.intervalSeconds ?? null
      };

      render();

      alert(
        "Session prepared. Connect the Mendi device, then Start Session."
      );
    }
  );

root
  .querySelector("#connect")
  .onclick = async () => {
    try {
      const device =
        await driver.connect();

      state.connection =
        "connected";

      state.device = {
        name:
          device.name ?? "Mendi"
      };

      state.error = null;
      render();
    } catch (error) {
      state.connection = "error";
      state.error = error.message;
      alert(error.message);
      render();
    }
  };

root
  .querySelector("#reconnect")
  .onclick = async () => {
    if (
      state.sessionStatus !==
      "paused_disconnected"
    ) {
      return;
    }

    try {
      await reconnectAcquisition(
        driver,
        acquisitionPacketHandler,
        { packetInspector }
      );

      state.connection =
        "connected";

      session.addMarker(
        "DEVICE_RECONNECTED",
        "system"
      );

      resumePreparedRecordingAfterReconnect({
        experimentEngine,
        state
      });

      saveCheckpoint(true);
      render();
    } catch (error) {
      state.connection =
        "disconnected";
      state.error = error.message;
      alert(error.message);
      render();
    }
  };

root
  .querySelector("#start")
  .onclick = async () => {
    if (!preparedMetadata) {
      alert(
        "Prepare the session first."
      );
      return;
    }

    if (
      state.connection !==
      "connected"
    ) {
      alert(
        "Connect the Mendi device first."
      );
      return;
    }

    if (
      state.recording ===
      "recording"
    ) {
      return;
    }

    // Create the new session before subscriptions are enabled so continuous
    // ABB1 notifications can never be written into the previous session.
    session = new Session();
    resetLiveState();

    const onPacket = packet => {
      session.appendRaw(packet);

      state.packetCount =
        session.raw.count();

      if (
        isMendiCharacteristic(
          packet.characteristicUuid,
          "ABB1"
        )
      ) {
        const decoded =
          decodeFrame(packet.bytes);

        if (decoded.decoded) {
          state.sensor.acquisitionMode =
            packet.transport === "poll"
              ? "POLL"
              : "NOTIFY";

          session.appendDecoded(
            decoded
          );

          state.sensor
            .decodedFrameCount =
            session.decoded.length;

          state.sensor.temperatureC =
            decoded.temperature;

          state.sensor.left = {
            red:
              decoded.left.red,
            infrared:
              decoded.left.ir,
            ambient:
              decoded.left.ambient
          };

          state.sensor.right = {
            red:
              decoded.right.red,
            infrared:
              decoded.right.ir,
            ambient:
              decoded.right.ambient
          };

          state.sensor.pulseReference = {
            red:
              decoded.pulseReference
                .red,
            infrared:
              decoded.pulseReference.ir,
            ambient:
              decoded.pulseReference
                .ambient
          };

          state.sensor.imu = {
            ...decoded.imu
          };

          if (
            state.monitor.imu.enabled
          ) {
            state.monitor.imu.status =
              "RECORDING";
          }

          const opticalSample =
            extractOpticalChannels(
              decoded
            );

          if (
            opticalSample &&
            session.status ===
              "recording"
          ) {
            traceBuffer.push(
              opticalSample,
              session.clock
                .nowSeconds()
            );
          }
        }
      }

      if (
        isMendiCharacteristic(
          packet.characteristicUuid,
          "ABB4"
        )
      ) {
        const adc =
          decodeAdc(packet.bytes);

        if (adc.decoded) {
          state.battery = {
            voltageMv:
              adc.voltage,
            charging:
              adc.charging,
            usb: adc.usb
          };
        }
      }

      updateTechnicalMonitor();
      saveCheckpoint();
      render();
    };

    acquisitionPacketHandler =
      onPacket;

    try {
      const started =
        await startAcquisition(
          driver,
          onPacket,
          {
            packetInspector,
            onFailure: error => {
              state.error =
                error.message;
              render();
            }
          }
        );

      if (!started) return;

      experimentEngine =
        beginPreparedRecording({
          session,
          preparedSetup:
            preparedMetadata,
          state,
          root,
          setProtocolBuilderLocked
        });

      state.monitor.imu = {
        enabled:
          preparedMetadata
            .imuEnabled === true,
        status:
          preparedMetadata
            .imuEnabled === true
            ? "WAITING"
            : "DISABLED"
      };

      state.quality =
        "NO SIGNAL";

      startMonitorTimer();
      saveCheckpoint(true);
      render();
    } catch (error) {
      try {
        await stopAcquisition(
          driver
        );
      } catch {
        // Preserve the acquisition/start error below.
      }

      state.error = error.message;
      state.recording = "idle";
      state.sessionStatus =
        "prepared";
      alert(error.message);
      render();
    }
  };

root
  .querySelector("#stop")
  .onclick = async () => {
    if (
      ![
        "recording",
        "paused_disconnected",
        "stopping"
      ].includes(
        state.sessionStatus
      )
    ) {
      return;
    }

    try {
      await stopAcquisition(
        driver
      );
    } catch (error) {
      state.error = error.message;
    }

    if (
      state.sessionStatus ===
      "stopping"
    ) {
      session.addMarker(
        "SESSION_END",
        "system"
      );

      session.stop();

      completePreparedExperiment({
        experimentEngine,
        state,
        root,
        setProtocolBuilderLocked
      });

      state.recording =
        "stopped";
    } else {
      abortPreparedExperiment({
        session,
        experimentEngine,
        state,
        root,
        setProtocolBuilderLocked
      });
    }

    experimentEngine = null;
    stopMonitorTimer();
    saveCheckpoint(true);
    render();

    const snapshot =
      session.snapshot();

    const metadata =
      buildMetadata(snapshot);

    const snirf =
      createSnirf(snapshot);

    const raw =
      rawPacketsCsv(
        session.raw.getAll()
      );

    const decoded =
      decodedOpticalCsv(
        session.decoded
      );

    const events =
      eventsTsv(
        session.markers.all()
      );

    const blob =
      new Blob(
        [
          JSON.stringify(
            {
              metadata,
              snirf,
              rawPacketsCsv: raw,
              decodedOpticalCsv:
                decoded,
              eventsTsv: events
            },
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      `${
        preparedMetadata
          .sessionCode ||
        "mendi-session"
      }_manifest.json`;

    a.click();
    URL.revokeObjectURL(url);
  };

root
  .querySelector("#marker")
  .onclick = () => {
    if (
      state.recording !==
      "recording"
    ) {
      return;
    }

    const label =
      prompt("Marker label:");

    if (!label) return;

    session.addMarker(
      label,
      "manual"
    );

    saveCheckpoint(true);
    render();
  };

driver.onDisconnected = async () => {
  try {
    await handleAcquisitionDisconnect(
      driver,
      {
        onDisconnected: () => {
          state.connection =
            "disconnected";

          if (
            state.recording ===
            "recording"
          ) {
            session.addMarker(
              "DEVICE_DISCONNECTED",
              "system"
            );

            pausePreparedRecordingOnDisconnect({
              experimentEngine,
              state
            });

            saveCheckpoint(true);
          }

          render();
        }
      }
    );
  } catch (error) {
    state.connection =
      "disconnected";
    state.error = error.message;

    if (
      state.recording ===
      "recording"
    ) {
      session.addMarker(
        "DEVICE_DISCONNECTED",
        "system"
      );

      pausePreparedRecordingOnDisconnect({
        experimentEngine,
        state
      });

      saveCheckpoint(true);
    }

    render();
  }
};

render();
