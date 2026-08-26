import {MarkerEngine} from './markers.js';
import {SessionManager} from './session.js';
import {SignalDashboard} from './dashboard.js';

const markers=new MarkerEngine();
const session=new SessionManager();
const dashboard=new SignalDashboard();

connectBtn.onclick=()=>{

document.getElementById('status').innerText=
'Ready for Mendi connection';

markers.add(
'DEVICE',
'Connection initiated'
);

};


startBtn.onclick=()=>{

markers.add(
'RECORDING',
'Recording started'
);

};


stopBtn.onclick=()=>{

markers.add(
'RECORDING',
'Recording stopped'
);

};


