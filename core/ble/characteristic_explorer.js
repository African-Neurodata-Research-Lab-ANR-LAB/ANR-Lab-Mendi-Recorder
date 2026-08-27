export class CharacteristicExplorer {

async inspect(service){

const characteristics =
await service.getCharacteristics();

return characteristics.map(c=>({

uuid:c.uuid,
properties:c.properties

}));

}

}
