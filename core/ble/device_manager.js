export class DeviceManager{

constructor(){
this.device=null;
}

async connect(){

this.device =
await navigator.bluetooth.requestDevice({

filters:[
{namePrefix:"Mendi"}
]

});

return this.device;

}

}
