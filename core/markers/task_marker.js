export class TaskMarker {

constructor(){

this.events=[];

}

add(label){

this.events.push({

label:label,

time:new Date().toISOString()

});

}

get(){

return this.events;

}

}
