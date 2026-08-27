export class PacketDecoder{

decode(data){

let bytes=[];

for(let i=0;i<data.byteLength;i++){
bytes.push(data.getUint8(i));
}

return {

timestamp:Date.now(),
bytes:bytes

};

}

}
