export class AcquisitionSession {

constructor(){

this.data={
metadata:{
lab:"African Neurodata Research Lab",
device:"Mendi"
},
samples:[],
markers:[]
};

}

addSample(sample){

this.data.samples.push(sample);

}

addMarker(marker){

this.data.markers.push(marker);

}

get(){

return this.data;

}

}
