class AutoMarkerEngine{
constructor(){
this.events=[];
}

addEvent(type,message){
this.events.push({
timestamp:new Date().toISOString(),
type,
message
});
}

getEvents(){
return this.events;
}
}
