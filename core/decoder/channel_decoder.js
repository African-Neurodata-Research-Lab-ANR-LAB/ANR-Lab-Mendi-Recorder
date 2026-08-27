export class ChannelDecoder {

decode(frame){

return {

timestamp:Date.now(),
channels:[],
raw:frame

};

}

}
