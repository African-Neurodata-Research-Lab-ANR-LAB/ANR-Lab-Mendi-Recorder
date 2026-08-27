export class NotificationManager {

async subscribe(characteristic, callback){

await characteristic.startNotifications();

characteristic.addEventListener(
'characteristicvaluechanged',
event=>{
callback(event.target.value);
});

}

}
