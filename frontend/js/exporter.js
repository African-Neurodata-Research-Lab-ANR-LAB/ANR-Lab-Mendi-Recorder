export class SessionExporter {

async export(session){

const files={

"metadata.json":
JSON.stringify(session.metadata,null,2),

"device_info.json":
JSON.stringify(session.deviceInfo,null,2),

"markers.csv":
session.markers.map(
m=>`${m.time},${m.type}`
).join("\n"),

"raw_packets.csv":
session.packets.map(
p=>`${p.timestamp},${p.size},${p.raw.join(" ")}`
).join("\n")

};

console.log("ANR session ready",files);

}

}
