export class DatasetExport {

create(session){

return {
metadata: session.metadata,
samples: session.samples,
markers: session.markers
};

}

}
