export class ChannelMapper {

constructor(){

this.channels={};

}

map(index,value){

this.channels[index]=value;

}

get(){

return this.channels;

}

}
