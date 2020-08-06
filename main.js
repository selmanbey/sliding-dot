class Circle {
  constructor(id) {
    this.element = document.getElementById(id);
    this.radius = this.element.getBoundingClientRect().width / 2;
    this.isDragging = false;
    this.move = (x, y) => {
      this.element.style.top = `${y - this.radius}px`;
      this.element.style.left = `${x - this.radius}px`;
    };
  }
}

class Line {
  constructor(id) {
    this.element = document.getElementById(id);
    this.x = this.element.getBoundingClientRect().left;
    this.y = this.element.getBoundingClientRect().top;
    this.isDragging = false;
    this.move = function (x, y) {
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
      this.x = x;
      this.y = y;
    };
  }
}

class Frame {
  constructor(id, circle) {
    this.element = document.querySelector(id);
    this.frame = this.element.getBoundingClientRect();
    this.boundaries = {
      left: circle.radius,
      right: this.frame.right - circle.radius,
      top: circle.radius,
      bottom: this.frame.bottom - circle.radius,
    };
  }
}

const limitMouseMove = (e, frame) => {
  let [x, y] = [e.clientX, e.clientY];

  if (e.clientX < frame.boundaries.left) x = frame.boundaries.left;
  if (e.clientX > frame.boundaries.right) x = frame.boundaries.right;
  if (e.clientY < frame.boundaries.top) y = frame.boundaries.top;
  if (e.clientY > frame.boundaries.bottom) y = frame.boundaries.bottom;

  return [x, y];
};

const getDominantDirection = (hline, vline, targetX, targetY) => {
  let hDistance = Math.abs(targetX - vline.x);
  let vDistance = Math.abs(targetY - hline.y);
  return hDistance - vDistance > 0 ? "horizontal" : "vertical";
};

const handleMouseMove = (e, frame, circle, hline, vline) => {
  [targetX, targetY] = limitMouseMove(e, frame);
  let dominantDirection = getDominantDirection(hline, vline, targetX, targetY);

  if (circle.isDragging) {
    if (dominantDirection === "horizontal") hline.move(hline.x, targetY);
    else vline.move(targetX, vline.y);
    dominantDirection = getDominantDirection(hline, vline, targetX, targetY);
  }

  if (dominantDirection === "horizontal") circle.move(targetX, hline.y);
  else circle.move(vline.x, targetY);
};

const showText = (id) => {
  document.getElementById(id).style.opacity = 1;
};

const hideText = (id) => {
  document.getElementById(id).style.opacity = 0;
};

const init = (circle) => {
  circle.move(verticalLine.x, horizontalLine.y);

  showText("text1");

  setTimeout(() => {
    hideText("text1");
    showText("text2");
  }, 5000);

  setTimeout(() => {
    hideText("text2");
    showText("text3");
  }, 13000);

  setTimeout(() => {
    hideText("text3");
    showText("text4");
  }, 18000);

  setTimeout(() => {
    hideText("text4");
  }, 22000);
};

const horizontalLine = new Line("h-line");
const verticalLine = new Line("v-line");

const circle = new Circle("circle");
circle.element.addEventListener("mousedown", () => (circle.isDragging = true));

let frame = new Frame("main", circle);
window.addEventListener("resize", () => (frame = new Frame("main", circle)));

document.addEventListener("mouseup", () => (circle.isDragging = false));

document.addEventListener("mousemove", (e) =>
  handleMouseMove(e, frame, circle, horizontalLine, verticalLine)
);

init(circle);
