export default function radialToLinearGradient(radialGradient) {
  var linearGradient = "linear-gradient(";
  var colorsAndPositions = radialGradient.match(/rgb\(\d+, \d+, \d+\)/g);
  for (var i = 0; i < colorsAndPositions.length; i++) {
    linearGradient += colorsAndPositions[i];
    if (i < colorsAndPositions.length - 1) {
      linearGradient += ", ";
    }
  }
  linearGradient += ")";
  return linearGradient;
}
