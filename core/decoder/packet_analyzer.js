export class PacketAnalyzer {

analyze(packets){

return {

packetCount:packets.length,

lengths:
[...new Set(
packets.map(p=>p.length)
)],

status:"pattern analysis pending"

};

}

}
