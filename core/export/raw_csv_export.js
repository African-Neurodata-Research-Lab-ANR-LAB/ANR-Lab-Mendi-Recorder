export class RawCSVExport {

create(packets){

let header =
"timestamp,length,bytes\n";

let rows =
packets.map(p=>
`${p.timestamp},${p.length},"${p.bytes.join(' ')}"`
).join("\n");

return header+rows;

}

}
