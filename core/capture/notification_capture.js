export class NotificationCapture {

constructor(){
this.packets=[];
}

add(data){

this.packets.push({
timestamp:new Date().toISOString(),
bytes:Array.from(
new Uint8Array(data.buffer)
)
});

}

get(){
return this.packets;
}

}
