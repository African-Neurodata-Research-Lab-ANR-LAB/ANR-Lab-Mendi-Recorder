export class ConnectionMonitor {

constructor(){
this.connected=false;
}

update(value){
this.connected=value;
}

status(){
return this.connected;
}

}
