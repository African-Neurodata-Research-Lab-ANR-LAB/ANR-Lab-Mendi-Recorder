export class LivePlot {

constructor(){

this.canvas=document.getElementById(
'signalCanvas'
);

this.ctx=this.canvas.getContext('2d');

}

draw(samples){

this.ctx.clearRect(
0,
0,
this.canvas.width,
this.canvas.height
);

this.ctx.beginPath();

samples.forEach((value,index)=>{

let x=index*2;
let y=120-value;

if(index===0)
this.ctx.moveTo(x,y);
else
this.ctx.lineTo(x,y);

});

this.ctx.stroke();

}

}
