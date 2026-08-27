export class SessionExporter{

constructor(){
this.session={
metadata:{
lab:"African Neurodata Research Lab"
},
packets:[],
markers:[]
};
}

addPacket(packet){
this.session.packets.push(packet);
}

addMarker(marker){
this.session.markers.push(marker);
}

get(){
return this.session;
}

}
