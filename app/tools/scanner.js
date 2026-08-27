scan.onclick = async()=>{

const device =
await navigator.bluetooth.requestDevice({
acceptAllDevices:true,
optionalServices:[]
});

output.innerText =
JSON.stringify({
name:device.name,
id:device.id
},null,2);

};
