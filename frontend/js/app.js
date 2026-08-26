import {BLEStream} from './ble_stream.js';
import {Recorder} from './recorder.js';
import {PacketDecoder} from './packet_decoder.js';

const recorder=new Recorder();
const decoder=new PacketDecoder();

const ble=new BLEStream((packet)=>{

const decoded=decoder.decode(packet);
recorder.add(decoded);

});


connectBtn.onclick=async()=>{
await ble.connect();
};


startBtn.onclick=()=>{
recorder.start();
};


stopBtn.onclick=()=>{
recorder.stop();
};
