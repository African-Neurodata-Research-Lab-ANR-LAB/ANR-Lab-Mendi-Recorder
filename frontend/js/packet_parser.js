export class PacketParser {

parse(bytes){

return {
timestamp:new Date().toISOString(),
length:bytes.length,
raw:Array.from(bytes)
};

}

}
