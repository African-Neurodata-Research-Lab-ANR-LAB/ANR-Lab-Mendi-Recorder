export class RawPacketExport {

constructor(){
this.packets=[];
}

add(packet){

this.packets.push({
timestamp:new Date().toISOString(),
bytes:Array.from(packet)
});

}

export(){
return this.packets;
}

}
