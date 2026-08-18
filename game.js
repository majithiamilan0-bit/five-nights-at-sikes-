import * as THREE from './vendor/three/build/three.module.js';
import { PointerLockControls } from './vendor/three/examples/jsm/controls/PointerLockControls.js';
import { drawPortrait } from './portrait.js';

// paint the intro/win portraits
drawPortrait(document.getElementById('portraitIntro').getContext('2d'), 220, 260);
drawPortrait(document.getElementById('portraitWin').getContext('2d'), 220, 260);

// ---------- Maze generation (recursive backtracker) ----------
const MAZE_COLS = 9, MAZE_ROWS = 6;
const GRID_W = MAZE_COLS * 2 + 1, GRID_H = MAZE_ROWS * 2 + 1;
const CELL = 4; // world units per tile

function generateMaze() {
  const cells = [];
  for (let y = 0; y < MAZE_ROWS; y++) {
    const row = [];
    for (let x = 0; x < MAZE_COLS; x++) row.push({ visited: false, walls: { N: true, S: true, E: true, W: true } });
    cells.push(row);
  }
  const stack = [[0, 0]];
  cells[0][0].visited = true;
  const dirs = [['N', 0, -1, 'S'], ['S', 0, 1, 'N'], ['E', 1, 0, 'W'], ['W', -1, 0, 'E']];
  while (stack.length) {
    const [cx, cy] = stack[stack.length - 1];
    const options = [];
    for (const [dir, dx, dy, opp] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < MAZE_COLS && ny >= 0 && ny < MAZE_ROWS && !cells[ny][nx].visited) options.push([dir, dx, dy, opp, nx, ny]);
    }
    if (!options.length) { stack.pop(); continue; }
    const [dir, dx, dy, opp, nx, ny] = options[Math.floor(Math.random() * options.length)];
    cells[cy][cx].walls[dir] = false;
    cells[ny][nx].walls[opp] = false;
    cells[ny][nx].visited = true;
    stack.push([nx, ny]);
  }
  const grid = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(true)); // true = wall
  for (let cy = 0; cy < MAZE_ROWS; cy++) {
    for (let cx = 0; cx < MAZE_COLS; cx++) {
      const tx = cx * 2 + 1, ty = cy * 2 + 1;
      grid[ty][tx] = false;
      if (!cells[cy][cx].walls.N) grid[ty - 1][tx] = false;
      if (!cells[cy][cx].walls.S) grid[ty + 1][tx] = false;
      if (!cells[cy][cx].walls.E) grid[ty][tx + 1] = false;
      if (!cells[cy][cx].walls.W) grid[ty][tx - 1] = false;
    }
  }
  return grid;
}

function bfsDistances(grid, sx, sy) {
  const dist = Array.from({ length: GRID_H }, () => Array(GRID_W).fill(-1));
  dist[sy][sx] = 0;
  const q = [[sx, sy]]; let head = 0;
  while (head < q.length) {
    const [x, y] = q[head++];
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H && !grid[ny][nx] && dist[ny][nx] === -1) {
        dist[ny][nx] = dist[y][x] + 1;
        q.push([nx, ny]);
      }
    }
  }
  return dist;
}

// ---------- Maths puzzle bank (single-digit answers) ----------
const PUZZLE_BANK = [
  { q: 'Solve for x: 3x + 4 = 19. What is x?', a: 5 },
  { q: 'A pipe leaks 2 litres every 3 minutes. How many litres leak in 12 minutes?', a: 8 },
  { q: 'What is 20% of 45?', a: 9 },
  { q: 'What is the remainder when 29 is divided by 6?', a: 5 },
  { q: 'Solve for x: 2(x - 3) = 10. What is x?', a: 8 },
  { q: 'A rectangle has area 24 and width 4. What is its length?', a: 6 },
  { q: 'What is 7 squared minus 40?', a: 9 },
  { q: 'If y = 3x - 1 and x = 3, what is y?', a: 8 },
  { q: 'What is the mean of 2, 4, 6, 8, 10?', a: 6 },
];
function pickPuzzles(n) {
  const pool = [...PUZZLE_BANK], chosen = [];
  for (let i = 0; i < n && pool.length; i++) chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return chosen;
}
const CLUE_SYMBOLS = ['Σ', '÷', '√', '%'];

// ---------- Procedural textures ----------
function makeCanvasTexture(draw, size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const cx = c.getContext('2d');
  draw(cx, size);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function noise(cx, size, alpha) {
  const n = size * size * 0.35;
  for (let i = 0; i < n; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const v = Math.random() * 40;
    cx.fillStyle = `rgba(${v},${v + 8},${v},${alpha})`;
    cx.fillRect(x, y, 1.4, 1.4);
  }
}

const wallTexture = makeCanvasTexture((cx, s) => {
  cx.fillStyle = '#232c1d';
  cx.fillRect(0, 0, s, s);
  const brickH = s / 8, brickW = s / 4;
  for (let row = 0; row < 8; row++) {
    const offset = (row % 2) * (brickW / 2);
    for (let col = -1; col < 5; col++) {
      const g = cx.createLinearGradient(0, row * brickH, 0, (row + 1) * brickH);
      const base = 40 + Math.random() * 20;
      g.addColorStop(0, `rgb(${base + 20},${base + 26},${base + 14})`);
      g.addColorStop(1, `rgb(${base - 10},${base - 6},${base - 12})`);
      cx.fillStyle = g;
      cx.fillRect(col * brickW + offset + 1, row * brickH + 1, brickW - 2, brickH - 2);
    }
  }
  cx.strokeStyle = 'rgba(5,8,4,0.6)';
  cx.lineWidth = 2;
  for (let row = 0; row <= 8; row++) { cx.beginPath(); cx.moveTo(0, row * brickH); cx.lineTo(s, row * brickH); cx.stroke(); }
  // grime streaks running down
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * s;
    const g = cx.createLinearGradient(x, 0, x, s);
    g.addColorStop(0, 'rgba(10,15,8,0)');
    g.addColorStop(1, `rgba(10,15,8,${0.15 + Math.random() * 0.2})`);
    cx.fillStyle = g;
    cx.fillRect(x, 0, 6 + Math.random() * 10, s);
  }
  noise(cx, s, 0.12);
}, 256);
wallTexture.repeat.set(1, 1);

const floorTexture = makeCanvasTexture((cx, s) => {
  cx.fillStyle = '#1b2016';
  cx.fillRect(0, 0, s, s);
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * s, y = Math.random() * s, r = 6 + Math.random() * 18;
    const g = cx.createRadialGradient(x, y, 0, x, y, r);
    const wet = Math.random() < 0.3;
    g.addColorStop(0, wet ? 'rgba(70,90,80,0.25)' : 'rgba(10,14,8,0.3)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = g;
    cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill();
  }
  noise(cx, s, 0.15);
}, 256);
floorTexture.repeat.set(MAZE_COLS, MAZE_ROWS);

const ceilTexture = makeCanvasTexture((cx, s) => {
  cx.fillStyle = '#0e130c';
  cx.fillRect(0, 0, s, s);
  cx.strokeStyle = 'rgba(40,50,32,0.4)';
  cx.lineWidth = 3;
  cx.beginPath(); cx.moveTo(s * 0.3, 0); cx.lineTo(s * 0.3, s); cx.moveTo(s * 0.7, 0); cx.lineTo(s * 0.7, s); cx.stroke();
  noise(cx, s, 0.1);
}, 256);
ceilTexture.repeat.set(MAZE_COLS, MAZE_ROWS);

function makeRuneTexture(symbol, solved) {
  return makeCanvasTexture((cx, s) => {
    cx.clearRect(0, 0, s, s);
    const col = solved ? '127,191,106' : '216,178,92';
    const g = cx.createRadialGradient(s / 2, s / 2, 4, s / 2, s / 2, s / 2);
    g.addColorStop(0, `rgba(${col},0.85)`);
    g.addColorStop(0.7, `rgba(${col},0.25)`);
    g.addColorStop(1, `rgba(${col},0)`);
    cx.fillStyle = g;
    cx.beginPath(); cx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); cx.fill();
    cx.strokeStyle = `rgba(${col},0.9)`;
    cx.lineWidth = 4;
    cx.beginPath(); cx.arc(s / 2, s / 2, s * 0.32, 0, Math.PI * 2); cx.stroke();
    cx.fillStyle = '#fff8e6';
    cx.font = `bold ${s * 0.34}px Georgia`;
    cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(symbol, s / 2, s / 2 + 2);
  }, 128);
}

// ---------- Scene setup ----------
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030503);
scene.fog = new THREE.FogExp2(0x03050a, 0.075);

const camera = new THREE.PerspectiveCamera(75, 2, 0.05, 60);
const EYE_HEIGHT = 1.6;

const controls = new PointerLockControls(camera, canvas);
scene.add(camera);

// lighting: dim ambient + camera-mounted torch spot + soft fill point light
const ambient = new THREE.AmbientLight(0x1b2417, 0.35);
scene.add(ambient);

const torch = new THREE.SpotLight(0xffdca8, 3.2, 16, Math.PI / 5, 0.55, 1.6);
torch.position.set(0, 0, 0);
const torchTarget = new THREE.Object3D();
torchTarget.position.set(0, 0, -1);
torch.target = torchTarget;
camera.add(torch, torchTarget);

const fill = new THREE.PointLight(0xffb877, 0.6, 5, 2);
camera.add(fill);

// first-person torch arm (simple, reads as holding a torch without a full body rig)
// kept small and tucked into the corner so it hints at the character without blocking the view
const armGroup = new THREE.Group();
const armMat = new THREE.MeshStandardMaterial({ color: 0x2d3f66, roughness: 0.8 });
const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.28, 8), armMat);
arm.rotation.z = Math.PI / 2.6;
arm.position.set(0.34, -0.28, -0.62);
const handMat = new THREE.MeshStandardMaterial({ color: 0xc89468, roughness: 0.7 });
const hand = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), handMat);
hand.position.set(0.42, -0.35, -0.75);
const torchBody = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.019, 0.13, 8), new THREE.MeshStandardMaterial({ color: 0x3a2c1e }));
torchBody.rotation.z = Math.PI / 2.6;
torchBody.position.set(0.48, -0.4, -0.85);
const torchTip = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffe6b0 }));
torchTip.position.set(0.53, -0.44, -0.92);
armGroup.add(arm, hand, torchBody, torchTip);
camera.add(armGroup);

// ---------- World state ----------
let grid, dist, stationTiles, exitTile, puzzles, solved, codeDigits;
let rats, floorDecor;
let lives, startTime, elapsed, gameWon;
let mazeGroup = null;
let stationMeshes = [], stationLights = [], exitLight = null, exitMesh = null;
const clock = new THREE.Clock();

function worldX(gx) { return gx * CELL; }
function worldZ(gy) { return gy * CELL; }

function isWallWorld(x, z) {
  const gx = Math.floor(x / CELL), gy = Math.floor(z / CELL);
  if (gx < 0 || gy < 0 || gx >= GRID_W || gy >= GRID_H) return true;
  return grid[gy][gx];
}
function circleHitsWall(x, z, r) {
  const pts = [[x - r, z], [x + r, z], [x, z - r], [x, z + r]];
  return pts.some(([px, pz]) => isWallWorld(px, pz));
}

function buildMaze() {
  if (mazeGroup) { scene.remove(mazeGroup); }
  mazeGroup = new THREE.Group();

  const wallHeight = 3.2;
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 0.95, metalness: 0.05 });
  const wallGeo = new THREE.BoxGeometry(CELL, wallHeight, CELL);
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      if (grid[y][x]) {
        const m = new THREE.Mesh(wallGeo, wallMat);
        m.position.set(worldX(x), wallHeight / 2, worldZ(y));
        mazeGroup.add(m);
      }
    }
  }

  const floorMat = new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 1 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(GRID_W * CELL, GRID_H * CELL), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(worldX((GRID_W - 1) / 2), 0, worldZ((GRID_H - 1) / 2));
  mazeGroup.add(floor);

  const ceilMat = new THREE.MeshStandardMaterial({ map: ceilTexture, roughness: 1 });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(GRID_W * CELL, GRID_H * CELL), ceilMat);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(worldX((GRID_W - 1) / 2), wallHeight, worldZ((GRID_H - 1) / 2));
  mazeGroup.add(ceil);

  // pipe details along some corridors
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0x3a4a30, roughness: 0.6, metalness: 0.4 });
  for (let y = 1; y < GRID_H - 1; y++) {
    for (let x = 1; x < GRID_W - 1; x++) {
      if (!grid[y][x] && Math.random() < 0.05) {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, CELL, 8), pipeMat);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(worldX(x), wallHeight - 0.3, worldZ(y) + CELL / 2);
        mazeGroup.add(pipe);
      }
    }
  }

  scene.add(mazeGroup);
}

function farthestTile() {
  let best = { x: 1, y: 1, d: -1 };
  for (let y = 0; y < GRID_H; y++) for (let x = 0; x < GRID_W; x++) if (!grid[y][x] && dist[y][x] > best.d) best = { x, y, d: dist[y][x] };
  return best;
}
function pickStationTiles() {
  const floors = [];
  for (let y = 0; y < GRID_H; y++)
    for (let x = 0; x < GRID_W; x++)
      if (!grid[y][x] && dist[y][x] > 3 && !(x === exitTile.x && y === exitTile.y)) floors.push({ x, y, d: dist[y][x] });
  floors.sort((a, b) => b.d - a.d);
  const chosen = [];
  for (const f of floors) {
    if (chosen.length >= 4) break;
    if (!chosen.some(c => Math.abs(c.x - f.x) + Math.abs(c.y - f.y) < 4)) chosen.push(f);
  }
  while (chosen.length < 4 && floors.length) chosen.push(floors[chosen.length % floors.length]);
  return chosen;
}

function buildStationsAndExit() {
  stationMeshes.forEach(m => scene.remove(m));
  stationLights.forEach(l => scene.remove(l));
  stationMeshes = []; stationLights = [];
  if (exitMesh) scene.remove(exitMesh);
  if (exitLight) scene.remove(exitLight);

  stationTiles.forEach((s, i) => {
    const tex = makeRuneTexture(CLUE_SYMBOLS[i], solved[i]);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(worldX(s.x), 1.5, worldZ(s.y));
    sprite.scale.set(0.9, 0.9, 0.9);
    scene.add(sprite);
    stationMeshes.push(sprite);

    const light = new THREE.PointLight(solved[i] ? 0x7fbf6a : 0xd8b25c, 0.9, 5, 2);
    light.position.set(worldX(s.x), 1.5, worldZ(s.y));
    scene.add(light);
    stationLights.push(light);
  });

  const allSolved = solved.every(Boolean);
  const gateGroup = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: allSolved ? 0x6fae5a : 0x6b3030, metalness: 0.6, roughness: 0.4 });
  const barGeo = new THREE.BoxGeometry(0.08, 2.4, 0.08);
  for (let i = -2; i <= 2; i++) {
    const bar = new THREE.Mesh(barGeo, frameMat);
    bar.position.set(worldX(exitTile.x) + i * 0.35, 1.2, worldZ(exitTile.y));
    gateGroup.add(bar);
  }
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.08), frameMat);
  topBar.position.set(worldX(exitTile.x), 2.4, worldZ(exitTile.y));
  gateGroup.add(topBar);
  exitMesh = gateGroup;
  scene.add(exitMesh);

  exitLight = new THREE.PointLight(allSolved ? 0x9fe08a : 0x8c2f2f, 1.2, 6, 2);
  exitLight.position.set(worldX(exitTile.x), 1.5, worldZ(exitTile.y));
  scene.add(exitLight);
}

function buildRats() {
  rats.forEach(r => scene.remove(r.mesh));
  rats = [];
  const floors = [];
  for (let y = 0; y < GRID_H; y++) for (let x = 0; x < GRID_W; x++) if (!grid[y][x] && dist[y][x] > 6) floors.push({ x, y });
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.9 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff2a2a });
  for (let i = 0; i < 3 && floors.length; i++) {
    const f = floors[Math.floor(Math.random() * floors.length)];
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), bodyMat);
    body.scale.set(1.6, 0.8, 1);
    group.add(body);
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), eyeMat);
    const eyeR = eyeL.clone();
    eyeL.position.set(0.12, 0.05, 0.06);
    eyeR.position.set(0.12, 0.05, -0.06);
    group.add(eyeL, eyeR);
    group.position.set(worldX(f.x), 0.14, worldZ(f.y));
    scene.add(group);
    rats.push({ mesh: group, speed: 1.1 + Math.random() * 0.6, dir: { x: 0, z: 0 }, retarget: 0 });
  }
}

function initGame() {
  grid = generateMaze();
  dist = bfsDistances(grid, 1, 1);
  exitTile = farthestTile();
  stationTiles = pickStationTiles();
  puzzles = pickPuzzles(4);
  solved = [false, false, false, false];
  codeDigits = [null, null, null, null];
  rats = [];

  buildMaze();
  buildStationsAndExit();
  buildRats();

  camera.position.set(worldX(1), EYE_HEIGHT, worldZ(1));
  camera.rotation.set(0, 0, 0);

  lives = 3;
  startTime = performance.now();
  elapsed = 0;
  gameWon = false;
  invuln = 0;
  updateHUD();
}
let invuln = 0;

// ---------- Input ----------
const keys = {};
window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

let bobTime = 0;

function updateMovement(dt) {
  let fwd = 0, right = 0;
  if (keys['w'] || keys['arrowup']) fwd += 1;
  if (keys['s'] || keys['arrowdown']) fwd -= 1;
  if (keys['d'] || keys['arrowright']) right += 1;
  if (keys['a'] || keys['arrowleft']) right -= 1;

  const speed = 3.2;
  if (fwd !== 0 || right !== 0) {
    const len = Math.hypot(fwd, right);
    fwd /= len; right /= len;

    const forwardDir = new THREE.Vector3();
    camera.getWorldDirection(forwardDir);
    forwardDir.y = 0; forwardDir.normalize();
    const rightDir = new THREE.Vector3().crossVectors(forwardDir, camera.up).normalize();

    const move = new THREE.Vector3()
      .addScaledVector(forwardDir, fwd)
      .addScaledVector(rightDir, right)
      .multiplyScalar(speed * dt);

    const pos = camera.position;
    const nx = pos.x + move.x, nz = pos.z + move.z;
    if (!circleHitsWall(nx, pos.z, 0.3)) pos.x = nx;
    if (!circleHitsWall(pos.x, nz, 0.3)) pos.z = nz;

    bobTime += dt * 8;
    pos.y = EYE_HEIGHT + Math.sin(bobTime) * 0.03;
  } else {
    bobTime = 0;
    camera.position.y += (EYE_HEIGHT - camera.position.y) * 0.2;
  }
}

function updateRats(dt) {
  const pos = camera.position;
  for (const rat of rats) {
    rat.retarget -= dt;
    if (rat.retarget <= 0) {
      const opts = [[1,0],[-1,0],[0,1],[0,-1],[0,0]];
      const [dx, dz] = opts[Math.floor(Math.random() * opts.length)];
      rat.dir = { x: dx, z: dz };
      rat.retarget = 0.8 + Math.random() * 1.2;
    }
    const p = rat.mesh.position;
    const nx = p.x + rat.dir.x * rat.speed * dt;
    const nz = p.z + rat.dir.z * rat.speed * dt;
    if (!circleHitsWall(nx, p.z, 0.15)) p.x = nx; else rat.retarget = 0;
    if (!circleHitsWall(p.x, nz, 0.15)) p.z = nz; else rat.retarget = 0;
    if (rat.dir.x || rat.dir.z) rat.mesh.rotation.y = Math.atan2(rat.dir.x, rat.dir.z);

    if (invuln <= 0) {
      const d = Math.hypot(p.x - pos.x, p.z - pos.z);
      if (d < 0.55) onCaught();
    }
  }
}

function onCaught() {
  lives -= 1;
  invuln = 1.5;
  updateHUD();
  if (lives <= 0) {
    controls.unlock();
    showOverlay('deathScreen');
  } else {
    camera.position.set(worldX(1), EYE_HEIGHT, worldZ(1));
  }
}

function updateProximity() {
  const pos = camera.position;
  for (let i = 0; i < stationTiles.length; i++) {
    if (solved[i]) continue;
    const s = stationTiles[i];
    const d = Math.hypot(worldX(s.x) - pos.x, worldZ(s.y) - pos.z);
    if (d < 1.3) { openPuzzle(i); return; }
  }
  const ex = worldX(exitTile.x), ez = worldZ(exitTile.y);
  if (Math.hypot(ex - pos.x, ez - pos.z) < 1.5) openGate();
}

function updateTorchFlicker(t) {
  const flicker = 3.0 + Math.sin(t * 9) * 0.25 + Math.sin(t * 23.7) * 0.15 + (Math.random() - 0.5) * 0.2;
  torch.intensity = Math.max(flicker, 1.8);
  fill.intensity = 0.5 + Math.sin(t * 9) * 0.08;
}

// ---------- HUD / overlays ----------
function updateHUD() {
  const codeStr = codeDigits.map(d => d === null ? '_' : d).join(' ');
  document.getElementById('codeDisplay').textContent = `CODE: ${codeStr}`;
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const s = Math.floor(elapsed % 60).toString().padStart(2, '0');
  document.getElementById('timerDisplay').textContent = `TIME: ${m}:${s}`;
  document.getElementById('livesDisplay').textContent = '❤️'.repeat(Math.max(lives, 0)) + '🖤'.repeat(3 - Math.max(lives, 0));
}

function showOverlay(id) {
  document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
function hideOverlays() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
}

let activeStation = null;
let modalOpen = false;

function openPuzzle(i) {
  if (modalOpen) return;
  modalOpen = true;
  activeStation = i;
  controls.unlock();
  document.getElementById('puzzleTitle').textContent = `Clue ${i + 1} of 4`;
  document.getElementById('puzzleQuestion').textContent = puzzles[i].q;
  document.getElementById('puzzleAnswer').value = '';
  document.getElementById('puzzleFeedback').textContent = '';
  document.getElementById('puzzleFeedback').className = '';
  showOverlay('puzzleModal');
  setTimeout(() => document.getElementById('puzzleAnswer').focus(), 50);
}

function openGate() {
  if (modalOpen) return;
  modalOpen = true;
  controls.unlock();
  const allSolved = solved.every(Boolean);
  const fb = document.getElementById('gateFeedback');
  fb.className = '';
  fb.textContent = allSolved ? '' : `The gate is sealed. ${solved.filter(s => !s).length} clue(s) left to find.`;
  if (!allSolved) fb.className = 'bad';
  document.getElementById('gateAnswer').value = '';
  showOverlay('gateModal');
}

document.getElementById('puzzleSubmit').addEventListener('click', () => {
  const val = document.getElementById('puzzleAnswer').value.trim();
  const fb = document.getElementById('puzzleFeedback');
  if (parseInt(val, 10) === puzzles[activeStation].a) {
    solved[activeStation] = true;
    codeDigits[activeStation] = puzzles[activeStation].a;
    fb.textContent = 'Correct! A digit locks into place.';
    fb.className = 'good';
    updateHUD();
    buildStationsAndExit();
    setTimeout(() => { hideOverlays(); modalOpen = false; }, 650);
  } else {
    fb.textContent = 'Not quite. Check your working.';
    fb.className = 'bad';
  }
});
document.getElementById('puzzleClose').addEventListener('click', () => { hideOverlays(); modalOpen = false; });
document.getElementById('puzzleAnswer').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('puzzleSubmit').click(); });

document.getElementById('gateSubmit').addEventListener('click', () => {
  const val = document.getElementById('gateAnswer').value.trim();
  const fb = document.getElementById('gateFeedback');
  if (!solved.every(Boolean)) { fb.textContent = 'Solve all 4 clues first.'; fb.className = 'bad'; return; }
  if (val === codeDigits.join('')) {
    gameWon = true;
    const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const s = Math.floor(elapsed % 60).toString().padStart(2, '0');
    document.getElementById('winStats').textContent = `Escaped in ${m}:${s} with ${lives} life/lives remaining.`;
    controls.unlock();
    showOverlay('winScreen');
    modalOpen = false;
  } else {
    fb.textContent = 'Wrong code. Try again.';
    fb.className = 'bad';
  }
});
document.getElementById('gateClose').addEventListener('click', () => { hideOverlays(); modalOpen = false; });
document.getElementById('gateAnswer').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('gateSubmit').click(); });

document.getElementById('startBtn').addEventListener('click', () => {
  initGame();
  hideOverlays();
  modalOpen = false;
  controls.lock();
});
document.getElementById('restartBtn').addEventListener('click', () => {
  initGame();
  hideOverlays();
  modalOpen = false;
  controls.lock();
});
document.getElementById('respawnBtn').addEventListener('click', () => {
  initGame();
  hideOverlays();
  modalOpen = false;
  controls.lock();
});

canvas.addEventListener('click', () => {
  const anyOverlayVisible = [...document.querySelectorAll('.overlay')].some(el => !el.classList.contains('hidden'));
  if (!anyOverlayVisible) controls.lock();
});

const promptTag = document.getElementById('promptTag');
controls.addEventListener('unlock', () => {
  const anyOverlayVisible = [...document.querySelectorAll('.overlay')].some(el => !el.classList.contains('hidden'));
  if (!anyOverlayVisible) promptTag.classList.remove('hidden');
});
controls.addEventListener('lock', () => promptTag.classList.add('hidden'));

// ---------- Resize ----------
function resize() {
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight - 52;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// ---------- Main loop ----------
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  if (invuln > 0) invuln -= dt;
  updateTorchFlicker(t);

  if (controls.isLocked && !modalOpen && !gameWon) {
    updateMovement(dt);
    updateRats(dt);
    updateProximity();
    elapsed = (performance.now() - startTime) / 1000;
    updateHUD();
  }

  renderer.render(scene, camera);
}

// initial idle scene before Start is pressed
initGame();
animate();
