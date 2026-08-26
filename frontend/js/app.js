import {PacketParser} from './packet_parser.js';
import {Recorder} from './recorder.js';
import {MendiBLE} from './bluetooth.js';
import {MarkerEngine} from './markers.js';

const parser=new PacketParser();
const recorder=new Recorder();
const markers=new MarkerEngine();

const ble=new MendiBLE(parser,recorder);

connect.onclick=async()=>{
await ble.connect();
markers.add('DEVICE','Connected');
};

start.onclick=()=>{
recorder.start();
markers.add('RECORDING','Started');
};

stop.onclick=()=>{
recorder.stop();
markers.add('RECORDING','Stopped');
};
