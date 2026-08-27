export class QualityReport {

generate(samples){

return {

sampleCount:samples.length,

signalQuality:"pending validation",

issues:[]

};

}

}
