import {DeviceMetadata} from '../../core/device/device_metadata.js';
import {SessionQC} from '../../core/qc/session_qc.js';

const metadata = new DeviceMetadata();
const qc = new SessionQC();

connect.onclick = ()=>{
status.innerText="Ready for Mendi";
};

marker.onclick = ()=>{
markers.innerHTML += "<p>Marker recorded</p>";
};
