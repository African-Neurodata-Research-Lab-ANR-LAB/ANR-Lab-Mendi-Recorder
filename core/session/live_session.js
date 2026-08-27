export class LiveSession {

constructor(){

this.samples=[];
this.markers=[];

}

addSample(sample){

this.samples.push(sample);

}

addMarker(marker){

this.markers.push(marker);

}

export(){

return {

samples:this.samples,

markers:this.markers

};

}

}
