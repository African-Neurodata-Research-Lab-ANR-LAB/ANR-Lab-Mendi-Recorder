export class SignalBuffer {

constructor(){
this.samples=[];
}

add(sample){
this.samples.push(sample);

if(this.samples.length>500){
this.samples.shift();
}
}

get(){
return this.samples;
}

}
