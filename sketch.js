let radius;
let centreX, centreY;
let cWidth, cHeight;
let x;
let isTop = false;
let es = [];
const maxEs = 400;
let bg;
let yellow;

async function setup() {
  frameRate(24)
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 1, 1, 1);
  noStroke();
  bg = color(80.54973, 0.34965333, 0.106082216, 1);
  yellow = color(47.62264, 0.6585073, 1, 1);
  background(bg);
  fill(yellow);

  radius = width > height ? width / 2.2 : height / 2.2;
  centreX = width / 2;
  centreY = height / 2;
  cWidth = width / 3;
  cHeight = cWidth * 0.8;
  x = -radius;
}

function draw() {
  background(bg);
  push();
  translate(centreX, centreY);
  rotate(frameCount / 200);

  let flashlightWidth = random(1, 3);
  let flashlightHeightMod = random(-1, +1);

  ellipse(
    random(-1, 1),
    random(-1, 1),
    flashlightWidth,
    flashlightWidth - flashlightHeightMod
  );

  fill(47.62264, 0.6585073, 1, 0.2)

  let f2Width = random(14, 16);
  let f2HeightMod = random(-2, +2);

  ellipse(
    random(-1, 1),
    random(-1, 1),
    f2Width,
    f2Width - f2HeightMod
  );


  let [y1, y2] = circleY(x, 0, 0, radius);
  if (!isNaN(y1) && !isNaN(y2)) {
    es.push({ x, y: isTop ? y2 : y1 });
  }
  if (es.length > maxEs) {
    es = es.slice(1);
  }

  es.forEach((e, i) => {
    const step = ((i + 1) / es.length) * 0.9;
    c = paletteLerp(
      [
        [color(0, 0), 0],
        [color(40.524666, 0.87039244, 0.58100533, 0.5), 0.75],
        [yellow, 1],
      ],
      step
    );

    const lx = lerp(e.x, 0, (1 - step) / 2);
    const ly = lerp(e.y, 0, (1 - step) / 2);

    push();
    translate(lx, ly);
    rotate(e.x);
    fill(c);
    ellipse(0, 0, cWidth, cHeight);
    pop();
  });
  pop();
  if (x >= radius) {
    x = -radius;
    isTop = !isTop;
  } else {
    x += 5;
  }

  // y = round(random(-windowHeight * 2, windowHeight * 2));
  // x = circleX(y, centreX, centreY, radius);

  // ellipse(x, y, width, height);
}

function circleY(x, cX, cY, r) {
  // circle equation (x – a)^2 + (y – b)^2 = r^2

  const rtVal = sqrt(sq(r) - sq(x - cX));
  return [rtVal + cY, -rtVal + cY];
}
