// core/initCanvas.js
export function createRocketCanvas() {
  const canvas = document.createElement("canvas");
  canvas.id = "main-canvas";
  canvas.width = 50;
  canvas.height = 50;
  canvas.style.position = "absolute";
  canvas.style.transformOrigin = "center center";
  document.body.appendChild(canvas);
  return canvas;
}

export function createFinalCanvas() {
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = 150;
  finalCanvas.height = 150;
  finalCanvas.style.position = "absolute";
  finalCanvas.style.pointerEvents = "none";
  finalCanvas.style.display = "none";
  document.body.appendChild(finalCanvas);
  return finalCanvas;
}

export function createBoomCanvas() {
  const boomCanvas = document.createElement("canvas");
  boomCanvas.width = 250;
  boomCanvas.height = 250;
  boomCanvas.style.position = "absolute";
  boomCanvas.style.pointerEvents = "none";
  boomCanvas.style.display = "none";
  document.body.appendChild(boomCanvas);
  return boomCanvas;
}
