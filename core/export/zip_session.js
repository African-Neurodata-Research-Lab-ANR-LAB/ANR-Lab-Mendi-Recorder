export class ZipSession {

prepare(session){

return {
"metadata.json": session.metadata,
"device.json": session.device,
"raw_packets.csv": session.samples,
"markers.csv": session.markers
};

}

}
