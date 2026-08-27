import {BLEReceiver} from './ble_receiver.js';
import {SessionRecorder} from './session_recorder.js';

const ble=new BLEReceiver();
const recorder=new SessionRecorder();

connectBtn.onclick=async()=>{
await ble.connect();
status.innerText='Device selected';
};

startBtn.onclick=()=>recorder.start();
stopBtn.onclick=()=>recorder.stop();
