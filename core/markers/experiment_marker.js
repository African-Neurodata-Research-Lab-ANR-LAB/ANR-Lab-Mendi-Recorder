export class ExperimentMarker {

constructor(){
this.events=[];
}

add(type){

this.events.push({

type:type,
time:new Date().toISOString()

});

}

get(){
return this.events;
}

}
