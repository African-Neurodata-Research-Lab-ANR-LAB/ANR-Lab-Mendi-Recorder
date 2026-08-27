export class ResearchPackage {

create(session){

return {

metadata:{
lab:"African Neurodata Research Lab",
device:"Mendi"
},

raw_packets:session.raw || [],

decoded_signal:session.samples || [],

markers:session.markers || [],

quality_report:session.quality || {}

};

}

}
