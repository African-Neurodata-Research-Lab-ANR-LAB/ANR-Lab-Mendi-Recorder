export class ChannelValidator {

validate(samples){

return {
channelCount: 0,
status: "requires hardware validation",
samples: samples.length
};

}

}
