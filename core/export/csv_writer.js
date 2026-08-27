export class CSVWriter {

samples(samples){

return samples.map(
sample => JSON.stringify(sample)
).join("\n");

}

}
