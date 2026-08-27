export class ServiceDiscovery {

constructor(){
this.services=[];
}

async discover(server){

this.services =
await server.getPrimaryServices();

return this.services;

}

}
