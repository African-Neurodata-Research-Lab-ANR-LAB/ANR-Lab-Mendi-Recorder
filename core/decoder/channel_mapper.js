export class ChannelMapper {

constructor(){

this.mapping={};

}

set(channel,value){

this.mapping[channel]=value;

}

get(){

return this.mapping;

}

}
