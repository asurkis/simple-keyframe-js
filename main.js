const key1 = { time: 0, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 } };
const key2 = { time: 1, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 } };

/*
x(t) = at^3 + bt^2 + ct + d
x'(t) = 3at^2 + 2bt + c

x(0) = x0
x(1) = x1
x'(0) = v0
x'(1) = v1

d = x0
a + b + c + d = x1
c = v0
3a + 2b + c = v1

d = x0
c = v0
a + b = x1 - c - d
a + 2 (x1 - c - d) + c = v1

a = v1 - c - 2 x1 + 2c + 2d =
= v1 + c - 2 x1 + 2 d =
= v1 + v0 - 2 x1 + 2 x0

b = x1 - a - c - d
b = x1 - (v1 + v0 - 2 x1 + 2 x0) - v0 - x0 =
= 3 (x1 - x0) - v1 - 2 v0

a = v1 + v0 - 2 x1 + 2 x0
b = 3 (x1 - x0) - v1 - 2 v0
c = v0
d = x0
*/

function sum() {
  result = { x: 0, y: 0 };
  for (let i = 0; i < arguments.length; ++i) {
    result.x += arguments[i].x;
    result.y += arguments[i].y;
  }
  return result;
}

function mul(num, vec) {
  return {
    x: num * vec.x,
    y: num * vec.y,
  };
}

function diff(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

function t(time) {
  return Math.min(1,
    (time - key1.time) / (key2.time - key1.time));
}

function state(t) {
  /*
  a = v1 + v0 - 2 x1 + 2 x0
  b = 3 (x1 - x0) - v1 - 2 v0
  c = v0
  d = x0
  */
  const a = sum(key1.vel, key2.vel, mul(2, diff(key1.pos, key2.pos)));
  const b = sum(mul(3, diff(key2.pos, key1.pos)), mul(-1, key2.vel), mul(-2, key1.vel));
  const c = key1.vel;
  const d = key1.pos;

  return {
    pos: sum(mul(t * t * t, a), mul(t * t, b), mul(t, c), d),
    vel: sum(mul(3 * t * t, a), mul(2 * t, b), c),
  };
}

function animationFrame(time) {
  const canvas = document.querySelector('canvas');
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let t = 0; t <= 1; t += 1/64) {
    const s = state(t);
    context.beginPath();
    context.arc(s.pos.x, s.pos.y, 5, 0, 2 * Math.PI);
    context.fillStyle = '#cff';
    context.fill();
    context.closePath();
  }
  const s = state(t(time));
  context.beginPath();
  context.arc(s.pos.x, s.pos.y, 10, 0, 2 * Math.PI);
  context.fillStyle = '#088';
  context.fill();
  context.closePath();
  context.strokeStyle = '#f88';
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(s.pos.x, s.pos.y);
  context.lineTo(s.pos.x + 0.25 * s.vel.x, s.pos.y + 0.25 * s.vel.y);
  context.stroke();
  context.closePath();
  requestAnimationFrame(animationFrame);
}

function onClick(e) {
  const s = state(t(e.timeStamp));
  key1.time = e.timeStamp;
  key1.pos = s.pos;
  key1.vel = s.vel;
  key2.pos.x = e.offsetX;
  key2.pos.y = e.offsetY;
  key2.vel = { x: 0, y: 0 };
  key2.time = e.timeStamp + 500;
}

window.addEventListener('load', () => {
  const canvas = document.querySelector('canvas');
  canvas.addEventListener('mousemove', onClick);
  requestAnimationFrame(animationFrame);
});
