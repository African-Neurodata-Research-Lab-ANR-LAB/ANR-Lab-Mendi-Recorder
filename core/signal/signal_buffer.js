export class SignalBuffer {

constructor(){

this.samples=[];

}

add(sample){

this.samples.push(sample);

}

get(){

return this.samples;

}

}
