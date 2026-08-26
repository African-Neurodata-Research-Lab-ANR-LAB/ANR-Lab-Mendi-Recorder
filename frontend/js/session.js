export class SessionRecorder {

constructor(){
this.packets=[];
this.markers=[];
this.recording=false;
}

start(){
this.recording=true;
}

stop(){
this.recording=false;
}

add(packet){

if(this.recording)
this.packets.push(packet);

}

getSession(){

return {
packets:this.packets,
markers:this.markers,
created:new Date().toISOString()
};

}

}
