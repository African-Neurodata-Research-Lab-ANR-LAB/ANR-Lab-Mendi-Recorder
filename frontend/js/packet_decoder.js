export class PacketDecoder{

decode(bytes){

return {
timestamp:new Date().toISOString(),
length:bytes.length,
raw:Array.from(bytes)
};

}

}
