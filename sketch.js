class DeltaTimer {
  constructor(ellapsed, step) {
    this.ellapsed = ellapsed;
    this.step = step;
  }

  // returns new DeltaTimer with updated ellapsed time
  update(deltaMs) {
    return new DeltaTimer(this.ellapsed + deltaMs, this.step);
  }

  // returns true if step or more ms have ellapsed
  check() {
    return this.ellapsed >= this.step;
  }

  // returns new DeltaTimer with ellapsed time reset to 0
  reset() {
    return new DeltaTimer(0, this.step);
  }

  // returns new DeltaTimer updated with ellapsed time, if the step has been reached the callback function is called and timer reset
  updateAnd(deltaMs, callbackfn) {
    const newDT = this.update(deltaMs);

    if (this.check()) {
      callbackfn();
      return this.reset();
    } else {
      return newDT;
    }
  }
}

// Radius path that the "walls" follow
let radius;
// Centre of the path
let centreX, centreY;
// how many frames ellapse before adding ellipses
const eFPS = 24;
// delta timer for adding new ellipses
let eDT = new DeltaTimer(0, fpsToMs(eFPS));
// Size of each stacked ellipse
let eW, eH;
let eX;
// Is the current arc on top
let isTop = false;
// array of ellipse points
let es = [];
// maximum number of ellipses
const maxEs = 300;
// colours
let bg, yellow;
// number of complete cycles around the path
let eCycles;
// rotation of the whole screen
let rotation;
// how many frames ellapse before updating the flashlight
const fFPS = 12;
// delta timer for flashlight updates
let fDT = new DeltaTimer(0, fpsToMs(fFPS));
// flashlight centre X & Y coordinates, width and height modifier
let fX, fY, fW, fHMod;
// sheer flashlight scatter X & Y coordinates, width and height modifier
let f2X, f2Y, f2W, f2HMod;
let started;

function setup() {
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
  eW = width / 3;
  eH = eW * 0.8;
  eX = -radius;
  eCycles = 0;
  rotation = 0;
}

function draw() {
  background(bg);
  push();
  translate(centreX, centreY);
  // rotation = frameCount / 200;
  rotate(rotation);

  // if (eCycles === 1) {
  //   const capture = P5Capture.getInstance();
  //   if (capture.state === 'idle') {
  //     capture.start({ format: 'mp4', framerate: 24, bitrate: 24000 });
  //   }
  // }

  // if (eCycles === 2) {
  //   const capture = P5Capture.getInstance();
  //   if (capture.state === "capturing") {
  //   capture.stop();}
  // }

  fDT = fDT.updateAnd(deltaTime, () => {
    fUpdated = 0;
    fX = random(-1, 1);
    fY = random(-1, 1);
    fW = random(1, 4);
    fHMod = random(-1, +1);
    f2X = random(-1, 1);
    f2Y = random(-1, 1);

    f2W = random(14, 16);
    f2HMod = random(-2, +2);
  });

  ellipse(fX, fY, fW, fW - fHMod);

  fill(47.62264, 0.6585073, 1, 0.2);

  ellipse(f2X, f2Y, f2W, f2W - f2HMod);
  eDT = eDT.updateAnd(deltaTime, () => {
    let [eY1, eY2] = circleY(eX, 0, 0, radius);
    if (!isNaN(eY1) && !isTop) {
      es.push({ x: eX, y: eY1 });
    } else if (!isNaN(eY2) && isTop) {
      es.push({ x: eX, y: eY2 });
    }

    if (eX >= radius) {
      eX = -radius;
      isTop = !isTop;
      eCycles += 0.5;
    } else {
      eX += 5;
    }
  });

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
    ellipse(0, 0, eW, eH);
    pop();
  });
  pop();

  // textFont('Roboto');
  // textSize(24);
  // text(`fps: ${frameRate()}\ncycles: ${cycles}\nrotation: ${rotation}`, 100, 100);

  // y = round(random(-windowHeight * 2, windowHeight * 2));
  // x = circleX(y, centreX, centreY, radius);

  // ellipse(x, y, width, height);
  describe(`Now ${isTop ? "top-side" : "below"} a deep yellow arc chews it's way left to right, falling away behind as it fades into the black, two halves of a circle. In the centre a pin-prick of light, a torch searching. Never receding, and never coming closer.`)
}

function circleY(x, cX, cY, r) {
  // circle equation (x – a)^2 + (y – b)^2 = r^2

  const rtVal = sqrt(sq(r) - sq(x - cX));
  return [rtVal + cY, -rtVal + cY];
}

function fpsToMs(fps) {
  return (1 / fps) * 1000;
}
