import {MendiBLE} from './bluetooth.js';
import {Recorder} from './recorder.js';
import {MarkerEngine} from './markers.js';

const recorder=new Recorder();
const markers=new MarkerEngine();

const ble=new MendiBLE((packet)=>{
recorder.add(packet);
});

connect.onclick=async()=>{
await ble.connect();
markers.add('DEVICE','Mendi connection initiated');
};

record.onclick=()=>{
recorder.start();
markers.add('RECORDING','Started');
};

stop.onclick=()=>{
recorder.stop();
markers.add('RECORDING','Stopped');
};

