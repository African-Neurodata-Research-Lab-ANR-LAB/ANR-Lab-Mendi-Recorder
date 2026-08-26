export class Recorder {

constructor(){
this.running=false;
this.packets=[];
}

start(){
this.running=true;
}

stop(){
this.running=false;
}

add(packet){
if(this.running){
this.packets.push(packet);
document.getElementById('packetCounter').innerText=this.packets.length;
}
}

getData(){
return this.packets;
}

}
