export class SessionRecorder{

constructor(){

this.session={
metadata:{
lab:"African Neurodata Research Lab",
device:"Mendi"
},
packets:[],
markers:[]
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

addMarker(type){

this.session.markers.push({

type:type,
time:new Date().toISOString()

});

}

get(){
return this.session;
}

}
