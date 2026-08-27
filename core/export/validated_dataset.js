export class ValidatedDataset {

create(session){

return {
metadata: session.metadata,
signals: session.signals,
quality: session.quality
};

}

}
