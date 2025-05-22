export function initClickHandler({
  canvas,
  resetState,
  getFlightMode,
  setFlightMode,
  getSpeed,
  setSpeed,
  getTarget,
  setTarget,
  animate,
  getRandomPoint,
}) {
  const removeField = document.querySelector("[data-destroy]");
  removeField.addEventListener("click", () => {
    const rect = removeField.getBoundingClientRect();
    const newPos = {
      x: rect.left + rect.width / 2 - canvas.width / 2,
      y: rect.top + rect.height / 2 - canvas.height / 2,
    };

    canvas.style.left = `${newPos.x}px`;
    canvas.style.top = `${newPos.y}px`;
    canvas.style.display = "block";

    resetState(newPos, getRandomPoint());

    setTimeout(() => {
      setFlightMode("target");
      setSpeed(1000);
      setTarget({ x: 0, y: 0 });
    }, 5000);

    requestAnimationFrame(animate);
  });
}
