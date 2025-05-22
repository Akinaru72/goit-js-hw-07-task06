// helpers/utils.js
export function getRandomPoint() {
  return {
    x: Math.random() * (window.innerWidth - 100),
    y: Math.random() * (window.innerHeight - 100),
  };
}

export function lerpAngle(a, b, t) {
  const diff = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return a + diff * t;
}
