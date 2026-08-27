export class ProfileExport {

create(profile){

return JSON.stringify(
profile,
null,
2
);

}

}
