let device;
let profile={
device:null,
services:[]
};

let packets=[];

connect.onclick = async()=>{

device = await navigator.bluetooth.requestDevice({
acceptAllDevices:true,
optionalServices:[]
});

profile.device=device.name;

output.textContent =
"Connected: "+device.name;

};


discover.onclick = async()=>{

const server = await device.gatt.connect();

const services =
await server.getPrimaryServices();

profile.services=[];

for(const service of services){

profile.services.push({
uuid:service.uuid,
characteristics:[]
});

}

output.textContent =
JSON.stringify(profile,null,2);

};


inspect.onclick = async()=>{

output.textContent =
"Characteristic inspection ready";

};


startCapture.onclick = ()=>{

packets=[];

output.textContent =
"Notification capture started";

};


stopCapture.onclick = ()=>{

output.textContent =
"Captured packets: "+packets.length;

};


exportProfile.onclick = ()=>{

downloadJSON(
profile,
"Mendi_Device_Profile.json"
);

};


exportPackets.onclick = ()=>{

downloadJSON(
packets,
"Mendi_Raw_Capture.json"
);

};


function downloadJSON(data,name){

const blob =
new Blob(
[JSON.stringify(data,null,2)],
{type:"application/json"}
);

const url =
URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;
a.download=name;
a.click();

}
