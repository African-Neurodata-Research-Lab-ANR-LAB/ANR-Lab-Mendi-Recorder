import {DeviceManager} from '../../core/ble/device_manager.js';
import {FrameDecoder} from '../../core/decoder/frame_decoder.js';
import {LiveRecorder} from '../../core/recorder/live_recorder.js';

const device = new DeviceManager();
const decoder = new FrameDecoder();
const recorder = new LiveRecorder();

connectBtn.onclick = async()=>{

await device.connect();

status.innerText="Mendi connected";

};

recordBtn.onclick=()=>{

recorder.start();

};

markerBtn.onclick=()=>{

events.innerHTML +=
'<p>Marker '+new Date().toISOString()+'</p>';

};
