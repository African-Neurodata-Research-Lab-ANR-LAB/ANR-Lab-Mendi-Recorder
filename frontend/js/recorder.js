class MendiRecorder{
constructor(marker){
this.marker=marker;
this.packets=[];
}

addPacket(packet){
this.packets.push(packet);
}

getSession(){
return {
packets:this.packets,
markers:this.marker.getEvents()
};
}
}
