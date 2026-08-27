export class SessionManager {

constructor(){
this.session={
metadata:{},
device:{},
samples:[],
markers:[]
};
}

addSample(sample){
this.session.samples.push(sample);
}

addMarker(marker){
this.session.markers.push(marker);
}

setMetadata(data){
this.session.metadata=data;
}

get(){
return this.session;
}

}
