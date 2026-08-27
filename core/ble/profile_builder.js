export class ProfileBuilder {

constructor(){
this.profile={
device:"",
services:[]
};
}

addService(service){
this.profile.services.push(service);
}

get(){
return this.profile;
}

}
