import {DeviceManager} from './device_manager.js';
import {SessionRecorder} from './session.js';

const device=new DeviceManager();
const recorder=new SessionRecorder();

connect.onclick=async()=>{
await device.connect();
};

start.onclick=()=>{
recorder.start();
};

stop.onclick=()=>{
recorder.stop();
};
