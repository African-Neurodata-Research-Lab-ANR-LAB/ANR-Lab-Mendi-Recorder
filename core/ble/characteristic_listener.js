export class CharacteristicListener{

subscribe(characteristic,callback){

characteristic.startNotifications();

characteristic.addEventListener(
"characteristicvaluechanged",
event=>{

callback(event.target.value);

});

}

}
