import {LiveSignalBuffer} from '../../core/signal/live_buffer.js';

const buffer = new LiveSignalBuffer();

start.onclick = ()=>{

status.innerText="Streaming";

};

marker.onclick = ()=>{

console.log({
event:"MARKER",
time:new Date().toISOString()
});

};
