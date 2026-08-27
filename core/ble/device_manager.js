import {MENDI_CONFIG} from './mendi_config.js';

export class DeviceManager {

async connect(){

return await navigator.bluetooth.requestDevice({

filters:[
{namePrefix:MENDI_CONFIG.namePrefix}
],

optionalServices:[
MENDI_CONFIG.serviceUUID
]

});

}

}
