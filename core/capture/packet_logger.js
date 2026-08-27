export class PacketLogger {

constructor(){
this.packets=[];
}

log(data){

this.packets.push({

timestamp:new Date().toISOString(),

length:data.byteLength,

bytes:Array.from(
new Uint8Array(data.buffer)
)

});

}

get(){
return this.packets;
}

}
