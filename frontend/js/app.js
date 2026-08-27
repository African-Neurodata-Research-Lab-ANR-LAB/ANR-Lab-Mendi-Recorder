import {SessionRecorder} from './session.js';
import {SessionExporter} from './exporter.js';

const recorder=new SessionRecorder();
const exporter=new SessionExporter();

connectBtn.onclick=()=>{
status.innerText="Mendi connection ready";
};

startBtn.onclick=()=>{
recorder.start();
};

stopBtn.onclick=()=>{
recorder.stop();
};

exportBtn.onclick=()=>{
exporter.export(recorder.getSession());
};
