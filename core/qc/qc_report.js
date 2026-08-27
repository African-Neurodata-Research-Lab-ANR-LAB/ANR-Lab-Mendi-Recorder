export class QCReport {

generate(session){

return {
samples: session.samples.length,
markers: session.markers.length,
status:"ready for validation"
};

}

}
