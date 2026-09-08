export function extractOpticalSample(frame) {

  if (!frame || frame.decoded !== true) {
    return null;
  }


  const left = frame.left;


  if (
    !left ||
    typeof left.red !== "number" ||
    typeof left.ir !== "number"
  ) {
    return null;
  }


  return {
    red: left.red,
    infrared: left.ir
  };

}