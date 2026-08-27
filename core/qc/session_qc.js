export class SessionQC {

run(session){

return {
samples: session.samples.length,
status:"pending signal validation"
};

}

}
