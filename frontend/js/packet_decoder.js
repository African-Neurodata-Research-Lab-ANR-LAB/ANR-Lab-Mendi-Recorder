export class PacketDecoder{
decode(bytes){
return {
timestamp:new Date().toISOString(),
size:bytes.length,
raw:Array.from(bytes)
};
}
}
