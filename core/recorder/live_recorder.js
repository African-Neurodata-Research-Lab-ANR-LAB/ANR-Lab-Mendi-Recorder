export class LiveRecorder {

constructor(){

this.active=false;
this.frames=[];

}

start(){
this.active=true;
}

stop(){
this.active=false;
}

add(frame){

if(this.active){
this.frames.push(frame);
}

}

getFrames(){

return this.frames;

}

}
