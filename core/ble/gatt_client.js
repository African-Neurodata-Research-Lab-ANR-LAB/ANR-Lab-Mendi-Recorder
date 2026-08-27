export class GattClient{

async connect(device){

return await device.gatt.connect();

}

}
