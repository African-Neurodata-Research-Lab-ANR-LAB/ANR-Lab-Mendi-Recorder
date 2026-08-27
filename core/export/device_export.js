export class DeviceExport {

create(device,services){

return {
device:device,
services:services,
created:new Date().toISOString()
};

}

}
