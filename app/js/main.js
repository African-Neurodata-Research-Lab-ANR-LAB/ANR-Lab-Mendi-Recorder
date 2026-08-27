import {SignalBuffer} from '../../core/signal/signal_buffer.js';
import {QualityMonitor} from '../../core/signal/quality_monitor.js';
import {LivePlot} from '../../core/visualization/live_plot.js';
import {ExperimentMarker} from '../../core/markers/experiment_marker.js';

const buffer=new SignalBuffer();
const quality=new QualityMonitor();
const plot=new LivePlot();
const marker=new ExperimentMarker();

connect.onclick=()=>{
status.innerText="Ready for Mendi stream";
};

start.onclick=()=>{
marker.add("START");
};

stop.onclick=()=>{
marker.add("STOP");
};

marker.onclick=()=>{
marker.add("EVENT");
markers.innerHTML += "<p>Marker added</p>";
};
