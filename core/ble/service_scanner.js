export class ServiceScanner {

async scan(server){

const services =
await server.getPrimaryServices();

return services.map(
s=>s.uuid
);

}

}
