export class SessionMetadata {

create(){

return {

sessionID:
"ANR-"+Date.now(),

created:
new Date().toISOString(),

device:
"Mendi"

};

}

}
