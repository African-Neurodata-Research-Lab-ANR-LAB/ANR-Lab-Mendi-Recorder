export class AcquisitionController {

constructor(){

this.running=false;
this.samples=[];
this.markers=[];

}

start(){

this.running=true;

}

stop(){

this.running=false;

}

addSample(sample){

if(this.running){

this.samples.push(sample);

}

}

addMarker(marker){

this.markers.push(marker);

}

getSession(){

return {

samples:this.samples,

markers:this.markers

};

}

}
