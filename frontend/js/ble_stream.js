import {MENDI_CONFIG} from './config.js';

export class BLEStream {

constructor(onPacket){
this.onPacket=onPacket;
}

async connect(){

const device =
await navigator.bluetooth.requestDevice({

filters:[
{namePrefix:MENDI_CONFIG.namePrefix}
],

optionalServices:[
MENDI_CONFIG.serviceUUID
]

});

document.getElementById("status").innerText =
"Connected: " + device.name;

const server =
await device.gatt.connect();

return server;

}

}
