export class SignalDecoder {

constructor(){
this.channels=[];
}

decode(packet){

return {

timestamp: packet.timestamp,

raw: packet.bytes,

channels:this.extractChannels(packet.bytes)

};

}

extractChannels(bytes){

// Channel mapping will be validated
// using real Mendi packet captures

return [];

}

}
