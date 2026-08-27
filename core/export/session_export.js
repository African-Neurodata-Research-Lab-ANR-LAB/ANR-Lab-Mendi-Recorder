export class SessionExport{

create(session){

return JSON.stringify(
session,
null,
2
);

}

}
