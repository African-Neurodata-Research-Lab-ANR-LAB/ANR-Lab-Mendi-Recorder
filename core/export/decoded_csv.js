export class DecodedCSV {

create(samples){

let header="timestamp,channels\n";

return header + samples.map(
s=>`${s.timestamp},${JSON.stringify(s.channels)}`
).join("\n");

}

}
