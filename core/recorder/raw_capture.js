export class RawCapture {

constructor(){
this.frames=[];
}

add(frame){

this.frames.push({
time:new Date().toISOString(),
data:Array.from(frame)
});

}

get(){
return this.frames;
}

}
