// task-6.js
import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";
import {
  createRocketCanvas,
  createBoomCanvas,
  createFinalCanvas,
} from "../core/initCanvas.js";
import { getRandomPoint, lerpAngle } from "../helpers/utils.js";
import { startThirdAnimationAt } from "../animations/finalEffect.js";
// --------------------------------------------------------

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

function getMaxElements(size) {
  const screenHeight = window.innerHeight;
  const rows = Math.floor(screenHeight / size);
  const valC = screenHeight - rows;

  console.log(valC);
  const D = 35 * 35 + 4 * 5 * valC;

  console.log(D);
  const sqrtD = Math.sqrt(D);
  const result = Math.floor((-35 + sqrtD) / (2 * 5));
  console.log(result);
  return result;
}

let inputValue = 0;
const inputField = document.querySelector("input");
const createField = document.querySelector("[data-create]");

const styles = getComputedStyle(inputField);

const height = inputField.offsetHeight;
const marginTop = parseFloat(styles.marginTop);
const marginBottom = parseFloat(styles.marginBottom);
const totalHeight = height + marginTop + marginBottom;
console.log("totalH", totalHeight);

let size = 30;

let maxElements = getMaxElements(size);
// console.log(maxElements);

inputField.addEventListener("input", () => {
  const val = parseInt(inputField.value, 10);
  if (val >= 1 && val <= maxElements) {
    inputValue = val;
    createField.disabled = false;
  } else {
    alert(`Enter number from 1 to ${maxElements}`);
    inputField.value = "";
    createField.disabled = true;
  }
});

let randomCoord = null;
let chosenBox = null;
let boxes = [];

createField.addEventListener("click", () => {
  if (boxes.length > 0) {
    return;
  }
  let size = 30;
  boxes = [];

  for (let i = 1; i <= inputValue; i++) {
    const divEl = document.createElement("div");
    divEl.style.backgroundColor = getRandomHexColor();
    divEl.style.width = `${size}px`;
    divEl.style.height = `${size}px`;
    divEl.classList.add("box");
    document.body.append(divEl);

    boxes.push(divEl);
    size += 10;
  }
  if (boxes.length === 0) {
    chosenBox = null;
    randomCoord = null;
    return;
  }

  const randomIndex = Math.floor(Math.random() * boxes.length);
  chosenBox = boxes[randomIndex];
  const rect = chosenBox.getBoundingClientRect();

  randomCoord = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  console.log("🎯 Координата обраного блоку:", randomCoord);
  createField.disabled = true;

  removeField.disabled = false;

  boxes.forEach((box, index) => {
    const rect = box.getBoundingClientRect();
    console.log(
      `📦 Box #${index + 1}: x=${rect.left + rect.width / 2}, y=${
        rect.top + rect.height / 2
      }`
    );
  });
  if (boxes.length > 0) {
    removeField.disabled = false;
    removeFieldAll.disabled = false;
    removeFieldHandler.disabled = false;
    console.log("HANDLER", removeFieldHandler.disabled);
  } else {
    removeField.disabled = true;
    removeFieldAll.disabled = true;
    removeFieldHandler.disabled = true;
  }
  inputField.value = "";
  createField.disabled = inputValue > 0;
});

// ----------------------------------------------

const rocketCanvas = createRocketCanvas();
const boomCanvas = createBoomCanvas();
const finalCanvas = createFinalCanvas();
const rocketAllCanvas = createRocketCanvas();

const removeField = document.querySelector("[data-destroy-one]");
removeField.disabled = true;
const rect = removeField.getBoundingClientRect();
const removeFieldAll = document.querySelector("[data-destroy-all]");
const rectAll = removeFieldAll.getBoundingClientRect();

let pos = {
  x: rect.left + rect.width / 2 - rocketCanvas.width / 2,
  y: rect.top - 90,
};

rocketCanvas.style.left = `${pos.x}px`;
rocketCanvas.style.top = `${pos.y}px`;
rocketCanvas.style.display = "block";

let posAll = {
  x: rectAll.left + rectAll.width / 2 - rocketAllCanvas.width / 2,
  y: rectAll.top - 90,
};
console.log(posAll);
rocketAllCanvas.style.left = `${posAll.x}px`;
rocketAllCanvas.style.top = `${posAll.y}px`;
rocketAllCanvas.style.display = "block";

let target = getRandomPoint();
let angle = 0;
let SPEED = 500;

const icon = new DotLottie({
  autoplay: true,
  loop: true,
  canvas: rocketCanvas,
  src: "./assets/my-animation.json",
});

const iconAll = new DotLottie({
  autoplay: true,
  loop: true,
  canvas: rocketAllCanvas,
  src: "./assets/my-animation.json",
});

const boom = new DotLottie({
  autoplay: false,
  loop: false,
  canvas: boomCanvas,
  src: "./assets/my-animation-boom.json",
});

boom.addEventListener("complete", () => {
  boomCanvas.style.display = "none";
});

function showBoom(x, y) {
  boomCanvas.style.left = `${x - 125}px`;
  boomCanvas.style.top = `${y - 125}px`;
  boomCanvas.style.display = "block";
  boom.play();
}

let isAnimating = false;

let flightMode = "random";
let animationFrameId = null;

function animate(t) {
  if (!isAnimating) {
    animationFrameId = null;
    return;
  }
  if (!animate.last) animate.last = t;
  const dt = (t - animate.last) / 1000;
  animate.last = t;

  const dx = target.x - pos.x;
  const dy = target.y - pos.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 10) {
    if (flightMode === "random") {
      showBoom(pos.x, pos.y);
      target = getRandomPoint();
    } else if (flightMode === "target") {
      if (chosenBox) {
        chosenBox.remove();
        boxes = boxes.filter((box) => box !== chosenBox);
        console.log(boxes);
        chosenBox = null;
      }
      if (boxes.length === 0) {
        isAnimating = false;
        removeField.disabled = true;
        removeFieldAll.disabled = true; // блокируем кнопку
        startThirdAnimationAt(pos.x, pos.y, resetRocket);
        return;
      }
      const randomIndex = Math.floor(Math.random() * boxes.length);
      chosenBox = boxes[randomIndex];
      const rect = chosenBox.getBoundingClientRect();
      randomCoord = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      console.log(randomCoord);

      isAnimating = false;
      startThirdAnimationAt(pos.x, pos.y, resetRocket);
      return;
    }
  } else {
    const a = Math.atan2(dy, dx);
    angle = lerpAngle(angle, a, 0.05);
    pos.x += Math.cos(a) * SPEED * dt;
    pos.y += Math.sin(a) * SPEED * dt;

    rocketCanvas.style.left = `${pos.x}px`;
    rocketCanvas.style.top = `${pos.y}px`;
    rocketCanvas.style.transform = `rotate(${angle + Math.PI / 2}rad)`;
  }
  if (isAnimating) {
    requestAnimationFrame(animate);
  }
}

removeField.addEventListener("click", () => {
  if (isAnimating || animationFrameId !== null) return;

  console.log("resetRocket called — блокируем кнопку");
  removeField.disabled = true;

  const rect = removeField.getBoundingClientRect();

  pos.x = rect.left + rect.width / 2 - rocketCanvas.width / 2;
  pos.y = rect.top + rect.height / 2 - rocketCanvas.height / 2;

  rocketCanvas.style.left = `${pos.x}px`;
  rocketCanvas.style.top = `${pos.y}px`;
  rocketCanvas.style.display = "block";

  angle = 0;
  flightMode = "random";
  SPEED = 500;
  target = getRandomPoint();
  isAnimating = true;
  animate.last = null;
  animationFrameId = requestAnimationFrame(animate); // один запуск

  setTimeout(() => {
    if (randomCoord) {
      flightMode = "target";
      SPEED = 1000;
      target = randomCoord;
      //   if (!isAnimating && animationFrameId === null) {
      //     isAnimating = true;
      //     animationFrameId = requestAnimationFrame(animate);
      //   }
    } else {
      isAnimating = false;
      console.log("resetRocket called — разблокируем кнопку");
      removeField.disabled = false;
    }
    if (boxes.length === 0) {
      createField.disabled = false;
      removeField.disabled = true;
    }
  }, 5000);
});

let rockets = [];
let lastTime = null;

removeFieldAll.addEventListener("click", () => {
  if (isAnimating || animationFrameId !== null) return;
  rocketAllCanvas.style.display = "none";

  console.log("resetRocket called — блокируем кнопку");
  removeFieldAll.disabled = true;

  const rectAll = removeFieldAll.getBoundingClientRect();

  const rocketInstances = [];
  [...boxes].reverse().forEach((box, index) => {
    const canvas = createRocketCanvas();
    document.body.appendChild(canvas);
    console.log();

    const dotLottie = new DotLottie({
      autoplay: true,
      loop: true,
      canvas: canvas,
      src: "./assets/my-animation.json",
    });

    const startX = rectAll.left + rectAll.width / 2 - canvas.width / 2;
    const startY = rectAll.top + rectAll.height / 2 - canvas.height / 2 - 80;
    console.log(startX, startY);
    canvas.style.left = `${startX}px`;
    canvas.style.top = `${startY}px`;
    canvas.style.display = "block";

    const targetBox = box.getBoundingClientRect();
    const targetX = targetBox.left + targetBox.width / 2 - canvas.width / 2;
    const targetY = targetBox.top + targetBox.height / 2 - canvas.height / 2;

    rocketInstances.push({
      canvas,
      dotLottie,
      pos: { x: startX, y: startY },
      target: getRandomPoint(),
      finalTarget: { x: targetX, y: targetY },
      angle: 0,
      flightMode: "random",
      randomTimePassed: 0,
      delay: index * 500,
      active: false,
      startTime: null,
      box,
    });
  });

  rockets = rocketInstances;
  lastTime = null;
  requestAnimationFrame(animateAll);
});

let targets = [];

function updateTargetsFromBoxes() {
  targets = boxes.map((box) => {
    const rect = box.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  });
}

function animateAll(time) {
  if (!lastTime) lastTime = time;
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  let allFinished = true;

  for (const rocket of rockets) {
    if (!rocket.active) {
      rocket.delay -= dt * 1000;
      if (rocket.delay <= 0) {
        rocket.active = true;
        rocket.startTime = time;
      } else {
        continue;
      }
    }

    allFinished = false;

    if (rocket.flightMode === "random") {
      // showBoom(rocket.pos.x, rocket.pos.y);
      rocket.randomTimePassed += dt * 1000;

      if (!rocket.target || rocket.randomTimePassed >= 1000) {
        rocket.target = getRandomPoint();
        rocket.randomTimePassed = 0;
        // showBoom(rocket.pos.x, rocket.pos.y);
      }
      // showBoom(rocket.pos.x, rocket.pos.y);
      const dx = rocket.target.x - rocket.pos.x;
      const dy = rocket.target.y - rocket.pos.y;
      const angleToTarget = Math.atan2(dy, dx);
      rocket.angle = lerpAngle(rocket.angle, angleToTarget, 0.05);
      rocket.pos.x += Math.cos(angleToTarget) * 300 * dt;
      rocket.pos.y += Math.sin(angleToTarget) * 300 * dt;
      // showBoom(rocket.pos.x, rocket.pos.y);

      if (time - rocket.startTime >= 10000) {
        rocket.flightMode = "target";
        rocket.target = rocket.finalTarget;
      }
    } else if (rocket.flightMode === "target") {
      const dx = rocket.target.x - rocket.pos.x;
      const dy = rocket.target.y - rocket.pos.y;
      const dist = Math.hypot(dx, dy);
      const angleToTarget = Math.atan2(dy, dx);
      rocket.angle = lerpAngle(rocket.angle, angleToTarget, 0.05);
      const step = 1000 * dt;

      if (dist < step) {
        // startThirdAnimationAt(pos.x, pos.y);
        rocket.canvas.style.display = "none";
        rocket.canvas.remove();
        rockets.splice(rockets.indexOf(rocket), 1);
        if (rocket.box) {
          rocket.box.remove();
          boxes = boxes.filter((b) => b !== rocket.box);
        }

        startThirdAnimationAt(rocket.pos.x, rocket.pos.y);

        continue;
      }

      rocket.pos.x += Math.cos(angleToTarget) * step;
      rocket.pos.y += Math.sin(angleToTarget) * step;
    }

    rocket.canvas.style.left = `${rocket.pos.x}px`;
    rocket.canvas.style.top = `${rocket.pos.y}px`;
    rocket.canvas.style.transform = `rotate(${rocket.angle + Math.PI / 2}rad)`;
  }
  if (!allFinished) {
    requestAnimationFrame(animateAll);
  } else {
    removeFieldAll.disabled = false;
    rocketAllCanvas.style.display = "block";

    createField.disabled = false;
  }
}

function resetRocket() {
  finalCanvas.style.display = "none";

  let rect = removeField.getBoundingClientRect();
  pos.x = rect.left + rect.width / 2 - rocketCanvas.width / 2;
  pos.y = rect.top - 90;

  rocketCanvas.style.left = `${pos.x}px`;
  rocketCanvas.style.top = `${pos.y}px`;
  rocketCanvas.style.transform = "rotate(0rad)";
  rocketCanvas.style.display = "block";

  let rectAll = removeFieldAll.getBoundingClientRect();
  posAll.x = rectAll.left + rectAll.width / 2 - rocketAllCanvas.width / 2;
  posAll.y = rectAll.top - 90;

  rocketAllCanvas.style.left = `${posAll.x}px`;
  rocketAllCanvas.style.top = `${posAll.y}px`;
  rocketAllCanvas.style.transform = "rotate(0rad)";
  rocketAllCanvas.style.display = "block";

  angle = 0;
  flightMode = "random";
  isAnimating = false;

  animate.last = null;
  target = getRandomPoint();
  if (boxes.length === 0) {
    removeField.disabled = true;
    removeFieldAll.disabled = true;
  } else {
    removeField.disabled = false;
    removeFieldAll.disabled = false;
  }
  if (boxes.length === 0) {
    removeField.disabled = true;
    removeFieldAll.disabled = true;
  } else {
    removeField.disabled = false;
    removeFieldAll.disabled = false;
  }
  animationFrameId = null;
  finalCanvas.style.display = "none";
}

// ---------------------------------------------------

// --------------------------------------
const rocketHandlerCanvas = createRocketCanvas();

const removeFieldHandler = document.querySelector("[data-destroy-handler]");
removeFieldHandler.disabled = true;
const rectHandler = removeFieldHandler.getBoundingClientRect();

const iconHandler = new DotLottie({
  autoplay: true,
  loop: true,
  canvas: rocketHandlerCanvas,
  src: "./assets/my-animation.json",
});

let posHandler = {
  x: rectHandler.left + rectHandler.width / 2 - rocketHandlerCanvas.width / 2,
  y: rectHandler.top - 90,
};

rocketHandlerCanvas.style.left = `${posHandler.x}px`;
rocketHandlerCanvas.style.top = `${posHandler.y}px`;
rocketHandlerCanvas.style.position = "absolute";
rocketHandlerCanvas.style.zIndex = "1000";
rocketHandlerCanvas.style.display = "block";

let direction = { x: 1, y: 0 };
const speed = 10;
let animationHandlerFrameId = null;

function updateRocketDirection(rocket, direction) {
  const angle = Math.atan2(direction.y, direction.x); // радианы
  const degrees = angle * (180 / Math.PI) + 90; // в градусы
  rocket.canvas.style.transform = `rotate(${degrees}deg)`;
}
let rocketActive = false;

function moveRocket(rocket) {
  if (rocketActive === false) return;

  rocket.pos.x += direction.x * speed;
  rocket.pos.y += direction.y * speed;

  const margin = 0;
  const leftLimit = margin;
  const rightLimit = window.innerWidth - rocket.canvas.width - margin;
  const topLimit = margin;
  const bottomLimit = window.innerHeight - rocket.canvas.height - margin;

  let collided = false;

  if (rocket.pos.x < leftLimit || rocket.pos.x > rightLimit) {
    direction.x *= -1;
    rocket.pos.x = Math.max(leftLimit, Math.min(rocket.pos.x, rightLimit));

    collided = true;
  }

  if (rocket.pos.y < topLimit || rocket.pos.y > bottomLimit) {
    direction.y *= -1;
    rocket.pos.y = Math.max(topLimit, Math.min(rocket.pos.y, bottomLimit));
    collided = true;
  }

  rocket.canvas.style.left = `${rocket.pos.x}px`;
  rocket.canvas.style.top = `${rocket.pos.y}px`;

  updateRocketDirection(rocket, direction);
  if (collided) {
    showBoom(rocket.pos.x, rocket.pos.y);
    collided = true;
  }

  for (const asteroid of asteroids) {
    if (checkCollision(rocket, asteroid)) {
      showBoom(rocket.pos.x, rocket.pos.y);

      rocket.canvas.style.display = "none";

      if (rocket.animationId) {
        cancelAnimationFrame(rocket.animationId);
        rocket.animationId = null;
      }
      removeFieldHandler.disabled = true;

      clearAsteroids();

      setTimeout(() => {
        const btnRect = removeFieldHandler.getBoundingClientRect();
        rocket.pos.x =
          btnRect.left + btnRect.width / 2 - rocket.canvas.width / 2;
        rocket.pos.y = btnRect.top - rocket.canvas.height - 10;

        rocket.canvas.style.left = `${rocket.pos.x}px`;
        rocket.canvas.style.top = `${rocket.pos.y}px`;
        rocket.canvas.style.display = "block";

        removeFieldHandler.disabled = false;
        if (boxes.length === 0) {
          createField.disabled = false;
          removeFieldHandler.disabled = true;
          removeField.disabled = true;
          removeFieldAll.disabled = true;
        }
      }, 1000);

      return;
    }
  }

  for (const box of boxes) {
    if (checkElementCollision(rocket, box)) {
      startThirdAnimationAt(rocket.pos.x, rocket.pos.y);
      box.remove();
      boxes.splice(boxes.indexOf(box), 1);
      console.log("boxes after meeting with rockets", boxes);
    }
    if (boxes.length === 0) {
      createField.disabled = false;
      removeFieldHandler.disabled = true;
      removeField.disabled = true;
      removeFieldAll.disabled = true;
    }
    console.log("removeFieldHandler.disabled", removeFieldHandler.disabled);
  }

  animationHandlerFrameId = requestAnimationFrame(() => moveRocket(rocket));
  if (rocketActive === false) return;
}

let rocketControlHandler = null;

function setupRocketControls(rocket) {
  if (rocketControlHandler) return;

  rocketControlHandler = function (event) {
    switch (event.key) {
      case "ArrowUp":
        direction = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        direction = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        direction = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        direction = { x: 1, y: 0 };
        break;
    }

    updateRocketDirection(rocket, direction);
  };

  window.addEventListener("keydown", rocketControlHandler);
}

function removeRocketControls() {
  if (rocketControlHandler) {
    window.removeEventListener("keydown", rocketControlHandler);
    rocketControlHandler = null;
  }
  if (animationHandlerFrameId) {
    cancelAnimationFrame(animationHandlerFrameId);
    animationHandlerFrameId = null;
  }
}
let rocket = null;

removeFieldHandler.addEventListener("click", () => {
  alert(
    "🚀 Rocket Controls:\n\n" +
      "Use the arrow keys to control the rocket:\n" +
      "↑ Up\n" +
      "↓ Down\n" +
      "← Left\n" +
      "→ Right\n" +
      "Press Esc to cancel the flight and reset the rocket.\n" +
      "💥 If the rocket hits an asteroid, the game restarts from the beginning."
  );
  rocketActive = true;
  if (isAnimating || animationFrameId !== null) return;

  console.log("resetRocket called — блокируем кнопку");
  removeFieldHandler.disabled = true;
  rocket = {
    pos: { ...posHandler },
    canvas: rocketHandlerCanvas,
  };

  setupRocketControls(rocket);
  moveRocket(rocket);
  clearAsteroids();

  for (let i = 0; i < asteroidCount; i++) {
    const x = Math.random() * (window.innerWidth - 150);
    const y = Math.random() * (window.innerHeight - 150);
    const asteroid = createAsteroid(x, y);
    asteroid.canvas.style.display = "block";
    asteroids.push(asteroid);
  }

  moveAsteroids();
  if (boxes.length === 0) {
    createField.disabled = false;
    removeFieldHandler.disabled = true;
  }
});
// ---------------------------------------------
// -----------------------------------------------------
let animationAsteroidId = null;
const asteroids = [];

function clearAsteroids() {
  if (animationAsteroidId) {
    cancelAnimationFrame(animationAsteroidId);
    animationAsteroidId = null;
  }
  for (const asteroid of asteroids) {
    asteroid.canvas.remove();
  }
  asteroids.length = 0;
}
function createAsteroidCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 150;
  canvas.height = 150;
  canvas.style.position = "absolute";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = 1000;
  document.body.appendChild(canvas);
  return canvas;
}

const asteroidCanvas = createAsteroidCanvas();

const asteroidCount = 3;
asteroids.length = 0;

function createAsteroid(x, y) {
  const canvas = createAsteroidCanvas();

  const icon = new DotLottie({
    autoplay: true,
    loop: true,
    canvas,
    src: "./assets/asteroid.json",
  });

  const asteroid = {
    canvas,
    pos: { x, y },
    dir: {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    },
    speed: 1 + Math.random() * 1.5,
  };

  const len = Math.hypot(asteroid.dir.x, asteroid.dir.y);
  asteroid.dir.x /= len;
  asteroid.dir.y /= len;

  return asteroid;
}

function moveAsteroids() {
  for (const asteroid of asteroids) {
    asteroid.dir.x += (Math.random() - 0.5) * 0.02;
    asteroid.dir.y += (Math.random() - 0.5) * 0.02;

    const len = Math.hypot(asteroid.dir.x, asteroid.dir.y);
    asteroid.dir.x /= len;
    asteroid.dir.y /= len;

    asteroid.pos.x += asteroid.dir.x * asteroid.speed;
    asteroid.pos.y += asteroid.dir.y * asteroid.speed;

    const w = asteroid.canvas.width;
    const h = asteroid.canvas.height;

    if (asteroid.pos.x < 0 || asteroid.pos.x > window.innerWidth - w) {
      asteroid.dir.x *= -1;
    }
    if (asteroid.pos.y < 0 || asteroid.pos.y > window.innerHeight - h) {
      asteroid.dir.y *= -1;
    }

    asteroid.canvas.style.left = `${asteroid.pos.x}px`;
    asteroid.canvas.style.top = `${asteroid.pos.y}px`;
  }

  animationAsteroidId = requestAnimationFrame(moveAsteroids);
}
// -----------------------------------------

function isCollision(rect1, rect2) {
  return !(
    rect1.left > rect2.right ||
    rect1.right < rect2.left ||
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top
  );
}

function isCenterCollision(rect1, rect2, threshold = 20) {
  const center1 = {
    x: rect1.left + rect1.width / 2,
    y: rect1.top + rect1.height / 2,
  };

  const center2 = {
    x: rect2.left + rect2.width / 2,
    y: rect2.top + rect2.height / 2,
  };

  const dx = center1.x - center2.x;
  const dy = center1.y - center2.y;

  const distance = Math.hypot(dx, dy);

  return distance <= threshold;
}

function checkCollision(rocket, asteroid) {
  const rRect = rocket.canvas.getBoundingClientRect();
  const aRect = asteroid.canvas.getBoundingClientRect();

  return isCollision(rRect, aRect);
}
// ------------------------------------------------
function checkElementCollision(rocket, element) {
  const rocketRect = rocket.canvas.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  return isCenterCollision(rocketRect, elementRect, 20);
}

function createbigBoomCanvas() {
  const bigBoomCanvas = document.createElement("canvas");
  bigBoomCanvas.width = 150;
  bigBoomCanvas.height = 150;
  bigBoomCanvas.style.position = "absolute";
  bigBoomCanvas.style.pointerEvents = "none";
  bigBoomCanvas.style.display = "none";
  document.body.appendChild(bigBoomCanvas);
  return bigBoomCanvas;
}
const bigBoomCanvas = createbigBoomCanvas();
const bigBoom = new DotLottie({
  autoplay: false,
  loop: false,
  canvas: bigBoomCanvas,
  src: "./assets/big_boom.json",
});

bigBoom.addEventListener("complete", () => {
  bigBoomCanvas.style.display = "none";
});

function showBigBoom(x, y) {
  bigBoomCanvas.style.left = `${x - 125}px`;
  bigBoomCanvas.style.top = `${y - 125}px`;
  bigBoomCanvas.style.display = "block";
  bigBoom.play();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && rocket) {
    rocketActive = false;
    console.log(
      "ESCbegin removeFieldHandler.disabled",
      removeFieldHandler.disabled
    );

    if (rocket.animationId) {
      cancelAnimationFrame(rocket.animationId);
      rocket.animationId = null;
    }
    console.log("Esx BBBBBOOOOOXXXX", removeFieldHandler.disabled);
    if (boxes.length === 0) {
      createField.disabled = false;
      removeFieldHandler.disabled = true;
      console.log("esc,removeFieldHandler", removeFieldHandler.disabled);
      removeField.disabled = true;
      removeFieldAll.disabled = true;
    } else {
      removeFieldHandler.disabled = false;
    }
    console.log("EsxEND BBBBBOOOOOXXXX", removeFieldHandler.disabled);

    clearAsteroids();

    const btnRect = removeFieldHandler.getBoundingClientRect();
    rocket.pos.x = btnRect.left + btnRect.width / 2 - rocket.canvas.width / 2;
    rocket.pos.y = btnRect.top - rocket.canvas.height - 10;

    rocket.canvas.style.left = `${rocket.pos.x}px`;
    rocket.canvas.style.top = `${rocket.pos.y}px`;
    rocket.canvas.style.display = "block";
  }
});
function removeRocket() {
  if (rocket && rocket.canvas) {
    if (rocket.animationId) {
      cancelAnimationFrame(rocket.animationId);
      rocket.animationId = null;
    }

    rocket.canvas.remove();
    rocket = null;
  }
}
