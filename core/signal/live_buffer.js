export class LiveSignalBuffer {

constructor(){

this.channels={};

}

add(channel,value){

if(!this.channels[channel]){
this.channels[channel]=[];
}

this.channels[channel].push({

time:Date.now(),
value:value

});

}

get(channel){

return this.channels[channel] || [];

}

}
