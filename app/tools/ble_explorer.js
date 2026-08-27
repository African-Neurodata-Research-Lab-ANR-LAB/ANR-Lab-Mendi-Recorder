let device=null;
let profile={
device:null,
services:[]
};

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

if(!device)return;

const server = await device.gatt.connect();

const services =
await server.getPrimaryServices();

profile.services=[];

for(const service of services){

profile.services.push({
uuid:service.uuid
});

}

output.textContent =
JSON.stringify(profile,null,2);

};

export.onclick=()=>{

const blob =
new Blob(
[JSON.stringify(profile,null,2)],
{type:"application/json"}
);

const url=URL.createObjectURL(blob);

const a=document.createElement("a");
a.href=url;
a.download="Mendi_Device_Profile.json";
a.click();

};
