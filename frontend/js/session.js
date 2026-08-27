export class SessionRecorder {

constructor(){

this.session={
metadata:{
lab:"African Neurodata Research Lab",
device:"Mendi"
},
packets:[],
markers:[],
deviceInfo:{}
};

this.recording=false;

}

start(){
this.recording=true;
}

stop(){
this.recording=false;
}

addPacket(packet){

if(this.recording)
this.session.packets.push(packet);

}

addMarker(marker){
this.session.markers.push(marker);
}

setDeviceInfo(info){
this.session.deviceInfo=info;
}

getSession(){
return this.session;
}

}
