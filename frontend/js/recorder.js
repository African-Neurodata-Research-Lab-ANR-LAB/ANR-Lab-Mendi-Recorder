export class Recorder {

constructor(){
this.recording=false;
this.packets=[];
}

start(){
this.recording=true;
}

stop(){
this.recording=false;
}

add(packet){

if(this.recording){
this.packets.push(packet);

document.getElementById("packetCount").innerText =
this.packets.length;
}

}

getSession(){

return {
created:new Date().toISOString(),
packets:this.packets
};

}

}
