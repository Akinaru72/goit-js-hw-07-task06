// // animations/rocket.js
// export function animate(t, state) {
//   if (!state.isAnimating) return;
//   if (!animate.last) animate.last = t;
//   const dt = (t - animate.last) / 1000;
//   animate.last = t;

//   const dx = state.target.x - state.pos.x;
//   const dy = state.target.y - state.pos.y;
//   const dist = Math.hypot(dx, dy);

//   if (dist < 10) {
//     if (state.flightMode === "random") {
//       state.showBoom(state.pos.x, state.pos.y);
//       state.target = state.getRandomPoint();
//     } else if (state.flightMode === "target") {
//       state.isAnimating = false;
//       state.startThirdAnimationAt(state.pos.x, state.pos.y);
//       return;
//     }
//   } else {
//     const a = Math.atan2(dy, dx);
//     state.angle = state.lerpAngle(state.angle, a, 0.05);
//     state.pos.x += Math.cos(a) * state.SPEED * dt;
//     state.pos.y += Math.sin(a) * state.SPEED * dt;

//     state.rocketCanvas.style.left = `${state.pos.x}px`;
//     state.rocketCanvas.style.top = `${state.pos.y}px`;
//     state.rocketCanvas.style.transform = `rotate(${
//       state.angle + Math.PI / 2
//     }rad)`;
//   }

//   requestAnimationFrame((t) => animate(t, state));
// }
