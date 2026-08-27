export class NIRSPipeline {

run(session){

return {
raw:session.samples,
opticalDensity:[],
HbO:[],
HbR:[],
HbT:[]
};

}

}
