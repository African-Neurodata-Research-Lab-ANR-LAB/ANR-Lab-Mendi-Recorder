export class Recorder{

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
this.packets.push({
time:new Date().toISOString(),
packet:Array.from(packet)
});
}
}

}
