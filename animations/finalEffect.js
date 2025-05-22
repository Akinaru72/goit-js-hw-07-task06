import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";
import { createFinalCanvas } from "../core/initCanvas.js";

const finalCanvas = createFinalCanvas();

const finalAnimation = new DotLottie({
  autoplay: false,
  loop: false,
  canvas: finalCanvas,
  src: "./assets/big_boom.json",
});

let _resetRocket = null;
let isAnimating = false;

function clearResetHandler() {
  if (_resetRocket && finalAnimation._resetHandler) {
    finalAnimation.removeEventListener(
      "complete",
      finalAnimation._resetHandler
    );
    finalAnimation._resetHandler = null;
    _resetRocket = null;
  }
}

function startThirdAnimationAt(x, y, resetRocket) {
  if (isAnimating) return;
  isAnimating = true;

  finalCanvas.style.left = `${x - finalCanvas.width / 2}px`;
  finalCanvas.style.top = `${y - finalCanvas.height / 2}px`;
  finalCanvas.style.display = "block";

  clearResetHandler();
  _resetRocket = resetRocket;

  finalAnimation._resetHandler = () => {
    console.log("Анимация взрыва завершена");

    const ctx = finalCanvas.getContext("2d");
    ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);

    finalCanvas.style.display = "none";
    if (_resetRocket) _resetRocket();

    isAnimating = false;
    clearResetHandler();
  };

  finalAnimation.addEventListener("complete", finalAnimation._resetHandler);

  finalAnimation.play();
}

export { startThirdAnimationAt };
