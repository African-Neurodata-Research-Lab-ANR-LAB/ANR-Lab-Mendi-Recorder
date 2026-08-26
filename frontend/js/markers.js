export class MarkerEngine {

constructor(){
this.events=[];
}

add(type,message){

const event={
time:new Date().toISOString(),
type,
message
};

this.events.push(event);

const box=document.getElementById('markers');
if(box){
box.innerHTML += `<p>${type}: ${message}</p>`;
}

}

}
