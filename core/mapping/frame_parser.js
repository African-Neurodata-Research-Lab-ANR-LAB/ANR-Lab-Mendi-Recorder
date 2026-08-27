export class FrameParser {

parse(packet){

return {

header: packet.bytes.slice(0,4),

payload: packet.bytes.slice(4),

length: packet.bytes.length

};

}

}
