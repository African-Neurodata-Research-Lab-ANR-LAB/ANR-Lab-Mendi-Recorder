import {MENDI_CONFIG} from './config.js';

export class MendiBLE {

constructor(parser, recorder){
this.parser=parser;
this.recorder=recorder;
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

document.getElementById('status').innerText =
'Selected: '+device.name;

const server =
await device.gatt.connect();

return server;

}

}
