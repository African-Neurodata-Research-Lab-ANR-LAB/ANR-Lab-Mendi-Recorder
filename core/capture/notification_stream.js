export class NotificationStream {

constructor(){
this.listeners=[];
}

subscribe(callback){
this.listeners.push(callback);
}

receive(data){

this.listeners.forEach(
callback=>callback(data)
);

}

}
