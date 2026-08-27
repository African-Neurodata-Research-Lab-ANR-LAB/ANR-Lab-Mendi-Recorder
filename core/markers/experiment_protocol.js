export class ExperimentProtocol {

constructor(){

this.events=[];

}

addEvent(type){

this.events.push({

type:type,

time:new Date().toISOString()

});

}

get(){

return this.events;

}

}
