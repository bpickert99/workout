// Animated figures that demonstrate each exercise.
//
// Each figure is a jointed body drawn in a 200x200 SVG. A pose places the hips,
// tilts the torso, puts each ankle where it should be (knees are solved
// automatically) and sets each arm. The animation eases between the poses in
// `frames`, spending `beat` seconds on each move, so the figure moves at the
// same pace the exercise should be done.
//
// Angles are in degrees: 0 points straight down, 90 points forward (or, in the
// front view, outward to the figure's side) and 180 points straight up.

const BODY = {
  thigh: 36, shin: 36, torso: 48, neck: 6, head: 11,
  upperArm: 28, forearm: 26, foot: 10,
  shoulderHalf: 15, hipHalf: 8
};
const GROUND = 185;
const ANKLE = 181;

// ---------- Pose helpers ----------

// Side view: limbs are [far side, near side]. Arms are {u, f}: upper arm and
// forearm angles relative to the torso, or {elbow: [x, y], f} to pin the elbow
// against the wall, with f an absolute angle. A pinned elbow is marked with a dot
// so it's clear the elbows are the only thing touching the wall.
function side(hip, torso, ankles, arms, feet = [90, 90]) {
  return { view: "side", hip, torso, ankles, arms, feet };
}

// Front view: limbs are [figure's right (left of picture), figure's left].
function front(hip, ankles, arms, feet = [90, 90]) {
  return { view: "front", hip, torso: 180, ankles, arms, feet };
}

const ARMS_CROSSED = { u: 20, f: 180 };
const ARMS_RELAXED = { u: 5, f: 12 };

// ---------- Props ----------

const ground = `<line class="prop" x1="8" y1="${GROUND}" x2="192" y2="${GROUND}"/>`;
const wallRight = x => `<rect class="prop-fill" x="${x}" y="14" width="12" height="${GROUND - 14}"/>`;
const wallLeft = x => `<rect class="prop-fill" x="${x - 12}" y="14" width="12" height="${GROUND - 14}"/>`;
const wallBehind = `<rect class="prop-wall" x="30" y="14" width="140" height="${GROUND - 14}"/>`;
const step = `<rect class="prop-fill" x="100" y="163" width="60" height="${GROUND - 163}"/>`;
// A chair seen from the side, its back on the left and its seat facing right.
const chairFacingRight = `
  <line class="prop" x1="44" y1="92" x2="44" y2="${GROUND}"/>
  <line class="prop" x1="44" y1="150" x2="96" y2="150"/>
  <line class="prop" x1="94" y1="150" x2="94" y2="${GROUND}"/>`;
// A chair seen from the side, its back on the left facing away from the figure.
const chairAhead = `
  <line class="prop" x1="132" y1="104" x2="132" y2="${GROUND}"/>
  <line class="prop" x1="132" y1="150" x2="182" y2="150"/>
  <line class="prop" x1="180" y1="150" x2="180" y2="${GROUND}"/>`;
// The back of a chair seen from the front, to the figure's left.
const chairBeside = `
  <line class="prop" x1="146" y1="100" x2="146" y2="${GROUND}"/>
  <line class="prop" x1="178" y1="100" x2="178" y2="${GROUND}"/>
  <line class="prop" x1="146" y1="100" x2="178" y2="100"/>
  <line class="prop" x1="146" y1="150" x2="178" y2="150"/>`;

// ---------- Exercises ----------

const sitPose = side([78, 142], 180, [[106, ANKLE], [110, ANKLE]], [ARMS_CROSSED, ARMS_CROSSED]);
const standTall = side([100, 110], 180, [[98, ANKLE], [102, ANKLE]], [ARMS_RELAXED, ARMS_RELAXED]);

const FIGURES = {
  "Side-step jacks": {
    props: "",
    beat: 0.9,
    frames: [
      front([100, 110], [[93, ANKLE], [107, ANKLE]], [{ u: 10, f: 10 }, { u: 10, f: 10 }]),
      front([92, 111], [[66, ANKLE], [107, ANKLE]], [{ u: 160, f: 170 }, { u: 160, f: 170 }]),
      front([100, 110], [[93, ANKLE], [107, ANKLE]], [{ u: 10, f: 10 }, { u: 10, f: 10 }]),
      front([108, 111], [[93, ANKLE], [134, ANKLE]], [{ u: 160, f: 170 }, { u: 160, f: 170 }])
    ]
  },
  "Mini wall sit": {
    props: wallLeft(52),
    beat: 1,
    frames: [
      side([62, 128], 180, [[84, ANKLE], [88, ANKLE]], [ARMS_RELAXED, ARMS_RELAXED])
    ]
  },
  "Elbow wall push-ups": {
    props: wallRight(158),
    beat: 3,
    frames: [
      side([111.6, 112.8], 164, [[92, ANKLE], [92, ANKLE]],
        [{ elbow: [153, 73], f: 200 }, { elbow: [153, 73], f: 200 }]),
      side([118.6, 115.2], 158, [[92, ANKLE], [92, ANKLE]],
        [{ elbow: [153, 73], f: 200 }, { elbow: [153, 73], f: 200 }])
    ]
  },
  "Seated knee lifts": {
    props: chairFacingRight,
    beat: 1.5,
    frames: [
      sitPose,
      side([78, 142], 184, [[106, ANKLE], [113, 165]], [ARMS_CROSSED, ARMS_CROSSED]),
      sitPose,
      side([78, 142], 184, [[113, 165], [110, ANKLE]], [ARMS_CROSSED, ARMS_CROSSED])
    ]
  },
  "Slow step-ups": {
    props: step,
    beat: 1.5,
    frames: [
      side([84, 110], 180, [[82, ANKLE], [86, ANKLE]], [ARMS_RELAXED, ARMS_RELAXED]),
      side([92, 113], 172, [[82, ANKLE], [116, 159]], [ARMS_RELAXED, ARMS_RELAXED]),
      side([118, 88], 180, [[116, 159], [120, 159]], [ARMS_RELAXED, ARMS_RELAXED]),
      side([92, 113], 172, [[82, ANKLE], [116, 159]], [ARMS_RELAXED, ARMS_RELAXED])
    ]
  },
  "Slow chair sit-to-stands": {
    props: chairFacingRight,
    beat: 1.5,
    frames: [
      sitPose,
      side([84, 140], 148, [[106, ANKLE], [110, ANKLE]], [ARMS_CROSSED, ARMS_CROSSED]),
      side([106, 110], 180, [[106, ANKLE], [110, ANKLE]], [ARMS_CROSSED, ARMS_CROSSED]),
      side([84, 140], 148, [[106, ANKLE], [110, ANKLE]], [ARMS_CROSSED, ARMS_CROSSED])
    ]
  },
  "Wall angels": {
    props: wallBehind,
    beat: 1.5,
    frames: [
      front([100, 110], [[92, ANKLE], [108, ANKLE]], [{ u: 90, f: 180 }, { u: 90, f: 180 }]),
      front([100, 110], [[92, ANKLE], [108, ANKLE]], [{ u: 145, f: 168 }, { u: 145, f: 168 }])
    ]
  },
  "Elbow wall plank": {
    props: wallRight(158),
    beat: 1,
    frames: [
      side([111.6, 112.8], 164, [[92, ANKLE], [92, ANKLE]],
        [{ elbow: [153, 73], f: 200 }, { elbow: [153, 73], f: 200 }])
    ]
  },
  "High-knee march": {
    props: "",
    beat: 0.4,
    frames: [
      side([100, 110], 180, [[100, ANKLE], [124, 146]], [{ u: 35, f: 90 }, { u: -30, f: -10 }]),
      standTall,
      side([100, 110], 180, [[124, 146], [100, ANKLE]], [{ u: -30, f: -10 }, { u: 35, f: 90 }]),
      standTall
    ]
  },
  "Slow reverse step-backs": {
    props: "",
    beat: 1.5,
    frames: [
      standTall,
      side([90, 126], 180, [[108, ANKLE], [64, 176]], [ARMS_RELAXED, ARMS_RELAXED], [90, 55]),
      standTall,
      side([90, 126], 180, [[64, 176], [108, ANKLE]], [ARMS_RELAXED, ARMS_RELAXED], [55, 90])
    ]
  },
  "Slow calf raises": {
    props: chairAhead,
    beat: 3,
    frames: [
      side([96, 110], 180, [[94, ANKLE], [98, ANKLE]], [ARMS_RELAXED, ARMS_RELAXED]),
      side([96, 102], 180, [[94, 173], [98, 173]], [ARMS_RELAXED, ARMS_RELAXED], [40, 40])
    ]
  },
  "Standing side leg raises": {
    props: chairBeside,
    beat: 1.5,
    frames: [
      front([100, 110], [[93, ANKLE], [107, ANKLE]], [{ u: 10, f: 10 }, { u: 32, f: 85 }]),
      front([102, 110], [[62, 174], [107, ANKLE]], [{ u: 10, f: 10 }, { u: 32, f: 85 }])
    ]
  }
};

// ---------- Geometry ----------

const toRad = a => a * Math.PI / 180;
const dir = (angle, length, mirror = 1) => [mirror * Math.sin(toRad(angle)) * length, Math.cos(toRad(angle)) * length];
const add = (p, v) => [p[0] + v[0], p[1] + v[1]];

// Places the knee between hip and ankle, bending toward `bendX` (+1 right, -1 left).
function solveLeg(hip, ankle, bendX) {
  const dx = ankle[0] - hip[0];
  const dy = ankle[1] - hip[1];
  const full = Math.hypot(dx, dy);
  const reach = Math.min(full, BODY.thigh + BODY.shin - 0.01);
  const ux = dx / full;
  const uy = dy / full;
  const h = Math.sqrt(BODY.thigh ** 2 - (reach / 2) ** 2);
  // Of the two directions perpendicular to the hip-ankle line, take the one toward bendX.
  const flip = -uy * bendX < 0 ? -1 : 1;
  const px = -uy * flip;
  const py = ux * flip;
  const knee = [hip[0] + ux * reach / 2 + px * h, hip[1] + uy * reach / 2 + py * h];
  return { knee, ankle: [hip[0] + ux * reach, hip[1] + uy * reach] };
}

function solveArm(shoulder, arm, torso, mirror) {
  if (arm.elbow) {
    return { elbow: arm.elbow, hand: add(arm.elbow, dir(arm.f, BODY.forearm)) };
  }
  const tilt = torso - 180;
  const elbow = add(shoulder, dir(arm.u + tilt, BODY.upperArm, mirror));
  return { elbow, hand: add(elbow, dir(arm.f + tilt, BODY.forearm, mirror)) };
}

function solvePose(pose) {
  const neckBase = add(pose.hip, dir(pose.torso, BODY.torso));
  const headCenter = add(neckBase, dir(pose.torso, BODY.neck + BODY.head));
  const isFront = pose.view === "front";
  // Front view: limb 0 is on the left of the picture, so it mirrors outward to the left.
  const mirrors = isFront ? [-1, 1] : [1, 1];
  const offset = (p, half, i) => isFront ? [p[0] + mirrors[i] * half, p[1]] : p;

  const legs = pose.ankles.map((ankle, i) => {
    const hip = offset(pose.hip, BODY.hipHalf, i);
    const { knee, ankle: reached } = solveLeg(hip, ankle, mirrors[i]);
    const toe = add(reached, dir(pose.feet[i], BODY.foot, mirrors[i]));
    return [hip, knee, reached, toe];
  });
  const arms = pose.arms.map((arm, i) => {
    const shoulder = offset(neckBase, BODY.shoulderHalf, i);
    const { elbow, hand } = solveArm(shoulder, arm, pose.torso, mirrors[i]);
    return [shoulder, elbow, hand];
  });
  return { hip: pose.hip, neckBase, headCenter, legs, arms, isFront };
}

// Interpolates every number in two poses of the same shape.
function lerpPose(a, b, t) {
  if (typeof a === "number") return a + (b - a) * t;
  if (typeof a === "string") return a;
  if (Array.isArray(a)) return a.map((v, i) => lerpPose(v, b[i], t));
  const out = {};
  for (const key of Object.keys(a)) out[key] = lerpPose(a[key], b[key], t);
  return out;
}

// ---------- Drawing ----------

const SVG_NS = "http://www.w3.org/2000/svg";
const points = list => list.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

function createFigure(exerciseName) {
  const spec = FIGURES[exerciseName];
  if (!spec) throw new Error(`No figure for exercise "${exerciseName}"`);

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 200 200");
  svg.setAttribute("class", "figure");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Demonstration of ${exerciseName}`);
  svg.innerHTML = `${spec.props}${ground}
    <polyline class="limb far" data-part="leg0"/>
    <polyline class="limb far" data-part="arm0"/>
    <line class="body" data-part="torso"/>
    <line class="limb" data-part="shoulders"/>
    <line class="limb" data-part="hips"/>
    <circle class="head" r="${BODY.head}" data-part="head"/>
    <polyline class="limb" data-part="leg1"/>
    <polyline class="limb" data-part="arm1"/>
    <circle class="contact hidden" r="5" data-part="contact"/>`;
  const part = name => svg.querySelector(`[data-part="${name}"]`);
  const els = {
    torso: part("torso"), shoulders: part("shoulders"), hips: part("hips"), head: part("head"),
    legs: [part("leg0"), part("leg1")], arms: [part("arm0"), part("arm1")],
    contact: part("contact")
  };
  // In the front view neither side is behind the body, so both sides get the same color.
  if (spec.frames[0].view === "front") {
    els.legs[0].classList.remove("far");
    els.arms[0].classList.remove("far");
  }

  function draw(pose) {
    const s = solvePose(pose);
    els.torso.setAttribute("x1", s.hip[0]);
    els.torso.setAttribute("y1", s.hip[1]);
    els.torso.setAttribute("x2", s.neckBase[0]);
    els.torso.setAttribute("y2", s.neckBase[1]);
    els.head.setAttribute("cx", s.headCenter[0]);
    els.head.setAttribute("cy", s.headCenter[1]);
    const shoulderLine = s.isFront ? [s.arms[0][0], s.arms[1][0]] : [s.neckBase, s.neckBase];
    const hipLine = s.isFront ? [s.legs[0][0], s.legs[1][0]] : [s.hip, s.hip];
    [[els.shoulders, shoulderLine], [els.hips, hipLine]].forEach(([el, [p, q]]) => {
      el.setAttribute("x1", p[0]); el.setAttribute("y1", p[1]);
      el.setAttribute("x2", q[0]); el.setAttribute("y2", q[1]);
    });
    s.legs.forEach((leg, i) => els.legs[i].setAttribute("points", points(leg)));
    s.arms.forEach((arm, i) => els.arms[i].setAttribute("points", points(arm)));
    const pinned = pose.arms.find(arm => arm.elbow);
    els.contact.classList.toggle("hidden", !pinned);
    if (pinned) {
      els.contact.setAttribute("cx", pinned.elbow[0]);
      els.contact.setAttribute("cy", pinned.elbow[1]);
    }
  }

  // Draws the figure at `seconds` into its looping animation.
  function update(seconds) {
    const frames = spec.frames;
    if (frames.length === 1) return draw(frames[0]);
    const position = (seconds / spec.beat) % frames.length;
    const index = Math.floor(position);
    const t = position - index;
    const eased = (1 - Math.cos(Math.PI * t)) / 2;
    draw(lerpPose(frames[index], frames[(index + 1) % frames.length], eased));
  }

  update(0);
  return { svg, update };
}
