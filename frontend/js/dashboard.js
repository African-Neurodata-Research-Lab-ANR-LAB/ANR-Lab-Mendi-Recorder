export class SignalDashboard{

constructor(){
this.values=[];
this.canvas=document.getElementById('signalCanvas');
this.ctx=this.canvas?.getContext('2d');
}

add(value){

this.values.push(value);

if(this.values.length>100)
this.values.shift();

this.draw();

}

draw(){

if(!this.ctx)return;

this.ctx.clearRect(0,0,
this.canvas.width,
this.canvas.height);

this.ctx.beginPath();

this.values.forEach((v,i)=>{

let x=i*7;
let y=100-v;

if(i===0)
this.ctx.moveTo(x,y);
else
this.ctx.lineTo(x,y);

});

this.ctx.stroke();

}

}
