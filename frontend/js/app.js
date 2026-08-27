import {PacketDecoder} from './packet_decoder.js';
import {SessionExporter} from './session_exporter.js';
import {BLENotifications} from './ble_notifications.js';

const decoder=new PacketDecoder();
const exporter=new SessionExporter();
const ble=new BLENotifications();

connect.onclick=async()=>{
await ble.connect();
};

start.onclick=()=>{
exporter.addMarker({
type:"START",
time:new Date().toISOString()
});
};

stop.onclick=()=>{
exporter.addMarker({
type:"STOP",
time:new Date().toISOString()
});
};
