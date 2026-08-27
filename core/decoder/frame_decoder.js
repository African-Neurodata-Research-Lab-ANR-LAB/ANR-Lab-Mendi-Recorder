export class FrameDecoder {

decode(data){

const bytes=[];

for(let i=0;i<data.byteLength;i++){
bytes.push(data.getUint8(i));
}

return {

timestamp:Date.now(),
length:bytes.length,
raw:bytes

};

}

}
