import { createState } from "./state.js";
import { startAcquisition, stopAcquisition } from "./acquisition.js";
import { MendiDriver } from "../ble/mendi-driver.js";
import { Session } from "../recording/session.js";
import { CheckpointStore } from "../recording/checkpoint-store.js";
import { decodeFrame } from "../protocol/frame-decoder.js";
import { rawPacketsCsv } from "../export/csv.js";
import { eventsTsv } from "../export/tsv.js";
import { buildMetadata } from "../export/metadata.js";
import { createSnirf } from "../export/snirf.js";
import { recorderMarkup } from "../ui/recorder.js";
import { readSetupForm, validateSetup } from "../ui/setup.js";
import { renderDashboard } from "../visualization/dashboard.js";

const root = document.querySelector("#app");
root.innerHTML = recorderMarkup();

const state = createState();
const driver = new MendiDriver();
const checkpoint = new CheckpointStore();
let session = new Session();
let preparedMetadata = null;

state.browserSupport = navigator.bluetooth ? "supported" : "unsupported";

function render() {
  renderDashboard(root, state);

  const markerList = root.querySelector("#markers");
  markerList.innerHTML = "";
  for (const marker of session.markers.all().slice(-10).reverse()) {
    const item = document.createElement("li");
    item.textContent = `${marker.onset.toFixed?.(3) ?? marker.onset}s - ${marker.description}`;
    markerList.appendChild(item);
  }
}

root.querySelector("#setup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = readSetupForm(event.currentTarget);
  const errors = validateSetup(data);
  if (errors.length) {
    state.error = errors.join(" ");
    alert(state.error);
    return;
  }
  preparedMetadata = data;
  alert("Session prepared. Connect the Mendi device.");
});

root.querySelector("#connect").onclick = async () => {
  try {
    const device = await driver.connect();
    state.connection = "connected";
    state.device = {
      name: device.name ?? "Mendi"
    };
    render();
  } catch (error) {
    state.connection = "error";
    state.error = error.message;
    alert(error.message);
    render();
  }
};

root.querySelector("#start").onclick = async () => {
  if (!preparedMetadata) {
    alert("Prepare the session first.");
    return;
  }

  session = new Session();
  session.start(preparedMetadata);
  state.recording = "recording";

  const onPacket = (packet) => {
    session.appendRaw(packet);
    state.packetCount = session.raw.count();
    checkpoint.save(session.snapshot());

    if (packet.characteristicUuid.toLowerCase().endsWith("abb1")) {
      const decoded = decodeFrame(packet.bytes);
      session.appendDecoded(decoded);
    }

    render();
  };

  try {
    await startAcquisition(driver, onPacket, {
      onFailure: (error) => {
        state.recording = "idle";
        state.error = error.message;
        session.stop();
        checkpoint.save(session.snapshot());
      }
    });

    state.quality = "REVIEW";
    render();
  } catch (error) {
    state.error = error.message;
    alert(error.message);
    render();
  }
};

root.querySelector("#stop").onclick = async () => {
  try {
    await stopAcquisition(driver);
  } catch (error) {
    state.error = error.message;
    alert(error.message);
  }

  session.stop();
  state.recording = "stopped";
  checkpoint.save(session.snapshot());
  render();

  const metadata = buildMetadata(session.snapshot());
  const snirf = createSnirf(session.snapshot());

  const raw = rawPacketsCsv(session.raw.getAll());
  const events = eventsTsv(session.markers.all());

  const blob = new Blob(
    [JSON.stringify({ metadata, snirf, rawPacketsCsv: raw, eventsTsv: events }, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${preparedMetadata.sessionCode || "mendi-session"}_manifest.json`;
  a.click();
  URL.revokeObjectURL(url);
};

root.querySelector("#marker").onclick = () => {
  if (state.recording !== "recording") return;
  const label = prompt("Marker label:");
  if (!label) return;
  session.addMarker(label, "manual");
  checkpoint.save(session.snapshot());
  render();
};

driver.onDisconnected = () => {
  state.connection = "disconnected";
  if (state.recording === "recording") {
    session.addMarker("DEVICE_DISCONNECTED", "system");
    checkpoint.save(session.snapshot());
  }
  render();
};

render();
