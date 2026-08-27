export class ServiceMapper {

constructor(){
this.map={};
}

add(service){

this.map[service.uuid]=service;

}

get(){

return this.map;

}

}
