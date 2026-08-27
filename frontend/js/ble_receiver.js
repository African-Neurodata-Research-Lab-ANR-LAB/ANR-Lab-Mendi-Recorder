import {MENDI_CONFIG} from './config.js';

export class BLEReceiver{
async connect(){
return await navigator.bluetooth.requestDevice({
filters:[{namePrefix:MENDI_CONFIG.namePrefix}]
});
}
}
