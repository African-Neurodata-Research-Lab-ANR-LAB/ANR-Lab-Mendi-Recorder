export class QualityMonitor {

calculate(samples){

if(samples.length===0)
return 0;

return Math.min(
100,
samples.length
);

}

}
