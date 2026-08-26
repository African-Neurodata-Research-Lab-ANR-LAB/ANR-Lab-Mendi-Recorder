export class SignalVisualizer {

constructor(){

this.canvas=document.getElementById("signal");
this.ctx=this.canvas.getContext("2d");
this.values=[];

}

update(value){

this.values.push(value);

if(this.values.length>100)
this.values.shift();

this.ctx.clearRect(
0,0,
this.canvas.width,
this.canvas.height
);

this.ctx.beginPath();

this.values.forEach((v,i)=>{

let x=i*8;
let y=120-v;

if(i===0)
this.ctx.moveTo(x,y);
else
this.ctx.lineTo(x,y);

});

this.ctx.stroke();

}

}
