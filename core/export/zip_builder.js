export class ZipBuilder {

create(session){

return {
raw_packets: session.samples,
metadata: session.metadata,
markers: session.markers,
device: session.device
};

}

}
