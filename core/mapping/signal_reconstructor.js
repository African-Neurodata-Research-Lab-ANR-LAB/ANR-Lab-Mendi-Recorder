export class SignalReconstructor {

reconstruct(frames){

return frames.map(frame=>({

timestamp:frame.timestamp,

channels:[]

}));

}

}
