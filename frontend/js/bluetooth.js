import {MENDI} from './config.js';

export class MendiBLE{

constructor(onPacket){
this.onPacket=onPacket;
this.device=null;
}

async connect(){

this.device = await navigator.bluetooth.requestDevice({
filters:[{namePrefix:MENDI.namePrefix}],
optionalServices:[MENDI.serviceUUID]
});

document.getElementById('status').innerText =
'Device selected: '+this.device.name;

console.log(this.device);

}

}
