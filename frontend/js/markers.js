export class MarkerEngine{

constructor(){
this.events=[];
}

add(type,message){

const e={
time:new Date().toISOString(),
type,
message
};

this.events.push(e);

const box=document.getElementById('markers');
if(box) box.innerHTML += `<p>${type}: ${message}</p>`;

}

}
