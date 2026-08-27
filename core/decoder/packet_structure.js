export class PacketStructure {

analyze(bytes){

return {

length:bytes.length,

header:bytes.slice(0,4),

payload:bytes.slice(4)

};

}

}
