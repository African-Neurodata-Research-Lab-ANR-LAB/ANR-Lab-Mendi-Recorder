import {MENDI} from './mendi_config.js';

export class DeviceManager {

async connect(){

const device =
await navigator.bluetooth.requestDevice({

filters:[
{namePrefix:MENDI.namePrefix}
]

});

document.getElementById('status').innerText =
'Selected '+device.name;

return device;

}

}
