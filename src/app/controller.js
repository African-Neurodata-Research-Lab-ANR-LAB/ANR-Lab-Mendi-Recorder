import {
  createState,
  syncExperimentState
} from "./state.js";

import {
  beginPreparedRecording,
  completePreparedExperiment,
  refreshPreparedRecording,
  requestProtocolCompletion
} from "./experiment-start.js";
import {
  startAcquisition,
  stopAcquisition,
  handleAcquisitionDisconnect
} from "./acquisition.js";

import { MendiDriver } from "../ble/mendi-driver.js";
import { PacketInspector } from "../ble/packet-inspector.js";

import { Session } from "../recording/session.js";
import { CheckpointStore } from "../recording/checkpoint-store.js";

import { decodeFrame } from "../protocol/frame-decoder.js";
import { isMendiCharacteristic } from "../ble/characteristic-utils.js";

import { rawPacketsCsv } from "../export/csv.js";
import { eventsTsv } from "../export/tsv.js";
import { buildMetadata } from "../export/metadata.js";
import { createSnirf } from "../export/snirf.js";

import {
  mountRecorder,
  setProtocolBuilderLocked
} from "../ui/recorder.js";
import {
  readSetupForm,
  validateSetup
} from "../ui/setup.js";

import { renderDashboard } from "../visualization/dashboard.js";

import {
  createPacketInspectionState
} from "./packet-inspection-state.js";
import { LiveTraceBuffer } from "../visualization/live-trace-buffer.js";
import { extractOpticalSample } from "../protocol/optical-extractor.js";
import { renderTrace } from "../visualization/trace-renderer.js";


const root = document.querySelector("#app");

mountRecorder(root);


const state = createState();

const driver = new MendiDriver();

const checkpoint = new CheckpointStore();

const packetInspector = new PacketInspector();

const packetInspectionState =
  createPacketInspectionState(packetInspector);

const traceBuffer = new LiveTraceBuffer(500);



let session = new Session();
let experimentEngine = null;

let preparedMetadata = null;


// Live monitor elapsed timer
let monitorTimer = null;
let monitorStartTime = null;


state.browserSupport =
  navigator.bluetooth
    ? "supported"
    : "unsupported";
function startMonitorTimer() {

  if (monitorTimer) {
    return;
  }


  monitorStartTime = Date.now();


  monitorTimer = setInterval(() => {


    if (state.recording !== "recording") {
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


    render();


  }, 1000);

}



function stopMonitorTimer() {


  if (monitorTimer) {

    clearInterval(
      monitorTimer
    );


    monitorTimer = null;

  }


  monitorStartTime = null;

}



function updateTechnicalMonitor() {

  const inspection =
    packetInspectionState.get();


  state.packetInspection =
    inspection;


  state.monitor.packetRateHz =
    Number(
      inspection.packetRateHz.toFixed(2)
    );


  state.monitor.channels = {

    ABB1:
      inspection.byCharacteristic.ABB1,

    ABB4:
      inspection.byCharacteristic.ABB4,

    ABB5:
      inspection.byCharacteristic.ABB5,

    unknown:
      inspection.byCharacteristic.unknown
  };


  state.monitor.signalQuality =
    state.packetCount > 0
      ? "ACTIVE"
      : "NO SIGNAL";
}



function render() {

  renderDashboard(
    root,
    state
  );


  const markerList =
    root.querySelector("#markers");


  if (!markerList) return;


  markerList.innerHTML = "";


  for (
    const marker of
    session.markers.all()
      .slice(-10)
      .reverse()
  ) {

    const item =
      document.createElement("li");


    item.textContent =
      `${marker.onset.toFixed?.(3) ?? marker.onset}s - ${marker.description}`;


    markerList.appendChild(item);
  }
}



root
.querySelector("#setup-form")
.addEventListener(
  "submit",
  (event)=>{


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


    preparedMetadata =
      data;


    alert(
      "Session prepared. Connect the Mendi device."
    );

  }
);




root
.querySelector("#connect")
.onclick =
async ()=>{


  try {


    const device =
      await driver.connect();


    state.connection =
      "connected";


    state.device = {

      name:
        device.name ?? "Mendi"
    };


    render();


  } catch(error){


    state.connection =
      "error";


    state.error =
      error.message;


    alert(error.message);


    render();
  }

};




root
.querySelector("#start")
.onclick =
async ()=>{


  if (!preparedMetadata){

    alert(
      "Prepare the session first."
    );

    return;
  }



  const onPacket =
  (packet)=>{


    session.appendRaw(
      packet
    );


    state.packetCount =
      session.raw.count();



    updateTechnicalMonitor();



    checkpoint.save(
      session.snapshot()
    );



    if (
      isMendiCharacteristic(
        packet.characteristicUuid,
        "ABB1"
      )
    ){

      const decoded =
  decodeFrame(packet.bytes);

session.appendDecoded(decoded);

const opticalSample =
  extractOpticalSample(decoded);

if (opticalSample) {
  traceBuffer.push(opticalSample);

  const canvas =
    root.querySelector("#trace");

  if (canvas) {
    renderTrace(
      canvas,
      traceBuffer.get()
    );
  }
}

    }


    render();

  };




  try {


    const started =
      await startAcquisition(
        driver,
        onPacket,
        {

          packetInspector,


          onFailure:
          (error)=>{

            state.error =
              error.message;


            render();

          }

        }
      );



    if (!started) return;



    session =
      new Session();



    experimentEngine =
      beginPreparedRecording({
        session,
        preparedSetup: preparedMetadata,
        state,
        root,
        setProtocolBuilderLocked
      });


startMonitorTimer();


state.quality =
  "REVIEW";


    render();



  } catch(error){


    state.error =
      error.message;


    alert(error.message);


    render();

  }

};





root
.querySelector("#stop")
.onclick =
async ()=>{


  try {

    await stopAcquisition(
      driver
    );


  } catch(error){


    state.error =
      error.message;


    alert(error.message);

  }



  session.stop();

  completePreparedExperiment({
    experimentEngine,
    state,
    root,
    setProtocolBuilderLocked
  });

  experimentEngine = null;

  stopMonitorTimer();


state.recording =
  "stopped";


  checkpoint.save(
    session.snapshot()
  );



  render();



  const snapshot =
    session.snapshot();



  const metadata =
    buildMetadata(
      snapshot
    );


  const snirf =
    createSnirf(
      snapshot
    );


  const raw =
    rawPacketsCsv(
      session.raw.getAll()
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
    URL.createObjectURL(
      blob
    );


  const a =
    document.createElement(
      "a"
    );


  a.href =
    url;


  a.download =
    `${
      preparedMetadata.sessionCode ||
      "mendi-session"
    }_manifest.json`;



  a.click();



  URL.revokeObjectURL(
    url
  );

};





root
.querySelector("#marker")
.onclick =
()=>{


  if (
    state.recording !==
    "recording"
  ) return;



  const label =
    prompt(
      "Marker label:"
    );



  if (!label) return;



  session.addMarker(
    label,
    "manual"
  );



  checkpoint.save(
    session.snapshot()
  );


  render();

};





driver.onDisconnected =
async ()=>{


  try {


    await handleAcquisitionDisconnect(
      driver,
      {

        onDisconnected:
        ()=>{


          state.connection =
            "disconnected";



          if (
            state.recording ===
            "recording"
          ){


            session.addMarker(
              "DEVICE_DISCONNECTED",
              "system"
            );


            session.stop();


            state.recording =
              "idle";


            checkpoint.save(
              session.snapshot()
            );

          }


          render();

        }

      }
    );


  } catch(error){


    state.connection =
      "disconnected";


    state.error =
      error.message;



    if (
      state.recording ===
      "recording"
    ){


      session.addMarker(
        "DEVICE_DISCONNECTED",
        "system"
      );


      session.stop();


      state.recording =
        "idle";


      checkpoint.save(
        session.snapshot()
      );

    }


    render();

  }

};



render();
