import {DeviceManager} from '../../core/ble/device_manager.js';
import {SessionRecorder} from '../../core/recorder/session_recorder.js';

const deviceManager=new DeviceManager();

const recorder=new SessionRecorder();


connect.onclick=async()=>{

await deviceManager.connect();

status.innerText="Mendi selected";

};


record.onclick=()=>{

recorder.start();

};


stop.onclick=()=>{

recorder.stop();

};


marker.onclick=()=>{

recorder.addMarker("EVENT");

};


export.onclick=()=>{

console.log(
recorder.get()
);

};
