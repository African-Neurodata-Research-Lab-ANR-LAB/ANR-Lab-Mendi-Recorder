export class PacketDecoder {

decode(bytes){

return {
timestamp: Date.now(),
length: bytes.length,
raw: Array.from(bytes)
};

}

}
