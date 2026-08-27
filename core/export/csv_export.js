export class CSVExport {

samplesToCSV(samples){

return samples.map(
s=>JSON.stringify(s)
).join("\n");

}

}
