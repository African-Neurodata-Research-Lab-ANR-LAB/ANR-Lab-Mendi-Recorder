export class OpticalDensity {

convert(intensity){

return intensity.map(
x=>Math.log(x)
);

}

}
