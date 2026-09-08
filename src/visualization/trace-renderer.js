export function renderTrace(canvas, traces) {

  if (!canvas) {
    return;
  }


  const context =
    canvas.getContext("2d");


  if (!context) {
    return;
  }


  const width =
    canvas.width;


  const height =
    canvas.height;


  context.clearRect(
    0,
    0,
    width,
    height
  );


  drawLine(
    context,
    traces.red ?? [],
    width,
    height
  );


  drawLine(
    context,
    traces.infrared ?? [],
    width,
    height
  );

}



function drawLine(
  context,
  samples,
  width,
  height
) {

  if (samples.length < 2) {
    return;
  }


  const min =
    Math.min(...samples);


  const max =
    Math.max(...samples);


  const range =
    max - min || 1;


  const step =
    width / (samples.length - 1);


  context.beginPath();


  samples.forEach(
    (value, index) => {

      const x =
        index * step;


      const normalized =
        (value - min) / range;


      const y =
        height -
        (normalized * height);


      if (index === 0) {

        context.moveTo(
          x,
          y
        );

      } else {

        context.lineTo(
          x,
          y
        );

      }

    }
  );


  context.stroke();

}