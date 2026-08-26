export class SessionManager{

constructor(){

this.session={
packets:[],
markers:[],
metadata:{
lab:"African Neurodata Research Lab"
}
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
