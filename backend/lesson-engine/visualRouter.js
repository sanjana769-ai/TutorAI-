function getVisualRenderer(lesson) {

  if (!lesson || !lesson.visual) {
    return "generic";
  }

  const { type, scene } = lesson.visual;


  if (
    type === "physics" &&
    scene === "magnetic-force"
  ) {
    return "magnetic-force";
  }


  if (
    type === "network" &&
    scene === "tcp-handshake"
  ) {
    return "tcp-handshake";
  }


  return "generic";
}


module.exports = getVisualRenderer;