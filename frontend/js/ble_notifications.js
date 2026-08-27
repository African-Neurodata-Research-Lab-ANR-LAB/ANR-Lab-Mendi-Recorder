import {MENDI_CONFIG} from './config.js';

export class BLENotifications{

async connect(){

const device =
await navigator.bluetooth.requestDevice({
filters:[
{namePrefix:MENDI_CONFIG.namePrefix}
]
});

document.getElementById("status").innerText =
"Selected: "+device.name;

return device;

}

}
