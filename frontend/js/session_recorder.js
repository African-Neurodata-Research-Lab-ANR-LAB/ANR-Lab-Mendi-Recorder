export class SessionRecorder{
constructor(){
this.running=false;
this.packets=[];
this.markers=[];
}
start(){this.running=true;}
stop(){this.running=false;}
addPacket(p){
if(this.running)this.packets.push(p);
}
get(){
return {packets:this.packets,markers:this.markers};
}
}
