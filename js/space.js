import { THREE, scene, camera } from './engine.js';

const PALETTE = [0xFF6BB5, 0xFF1493, 0xFF69B4, 0xFF85C8, 0xC46BFF, 0xFFD93D];
const PINK_SHADES = [0xFF6BB5, 0xFF1493, 0xFF69B4, 0xFF85C8, 0xFFB6D9];
let dimTarget = 1, dimCurrent = 1, dimTimer = 0;

// --- Stars (3000 particles, 50% pink-tinted) ---
const STAR_COUNT = 3000;
const starPositions = new Float32Array(STAR_COUNT * 3);
const starColors = new Float32Array(STAR_COUNT * 3);
for (let i = 0; i < STAR_COUNT; i++) {
  starPositions[i * 3]     = (Math.random() - 0.5) * 1500;
  starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
  starPositions[i * 3 + 2] = -200 - Math.random() * 800;
  const r = Math.random();
  if (r < 0.3) {
    // White stars
    starColors[i * 3] = starColors[i * 3 + 1] = starColors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
  } else if (r < 0.8) {
    // Pink stars
    const c = new THREE.Color(PINK_SHADES[Math.floor(Math.random() * PINK_SHADES.length)]);
    starColors[i * 3]     = c.r;
    starColors[i * 3 + 1] = c.g;
    starColors[i * 3 + 2] = c.b;
  } else {
    // Accent color stars
    const c = new THREE.Color(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    starColors[i * 3]     = c.r;
    starColors[i * 3 + 1] = c.g;
    starColors[i * 3 + 2] = c.b;
  }
}
const starGeom = new THREE.BufferGeometry();
starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
const starMat = new THREE.PointsMaterial({
  size: 2.5,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true,
});
const stars = new THREE.Points(starGeom, starMat);
scene.add(stars);

// --- Nebula (4 planes, pink-dominant) ---
const nebulaColors = [0xFF6BB5, 0xFF1493, 0xC46BFF, 0xFF85C8];
const nebulae = [];
nebulaColors.forEach((color, i) => {
  const geom = new THREE.PlaneGeometry(400, 400);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(
    (i % 2 === 0 ? -1 : 1) * (200 + Math.random() * 200),
    (i < 2 ? 1 : -1) * (150 + Math.random() * 150),
    -500 - Math.random() * 200
  );
  mesh.rotation.z = Math.random() * Math.PI;
  scene.add(mesh);
  nebulae.push({ mesh, speed: 0.1 + Math.random() * 0.2, phase: Math.random() * Math.PI * 2 });
});

// --- Heart geometry (shared) ---
function createHeartShape(s) {
  const shape = new THREE.Shape();
  shape.moveTo(0, -s * 0.6);
  shape.bezierCurveTo(0, -s * 0.9, -s * 0.85, -s * 0.95, -s * 0.85, -s * 0.35);
  shape.bezierCurveTo(-s * 0.85, s * 0.15, -s * 0.45, s * 0.55, 0, s * 0.9);
  shape.bezierCurveTo(s * 0.45, s * 0.55, s * 0.85, s * 0.15, s * 0.85, -s * 0.35);
  shape.bezierCurveTo(s * 0.85, -s * 0.95, 0, -s * 0.9, 0, -s * 0.6);
  return shape;
}

const heartShape = createHeartShape(1);
const heartGeom = new THREE.ShapeGeometry(heartShape);
const heartGeomExtruded = new THREE.ExtrudeGeometry(heartShape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 1 });

// --- Orbital sparkles (mix of hearts and stars) ---
const SPARKLE_COUNT = 15;
const sparkles = [];
const octGeom = new THREE.OctahedronGeometry(4, 0);
for (let i = 0; i < SPARKLE_COUNT; i++) {
  const isHeart = i < 6;
  const color = isHeart ? PINK_SHADES[i % PINK_SHADES.length] : PALETTE[i % PALETTE.length];
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const geom = isHeart ? heartGeomExtruded : octGeom;
  const mesh = new THREE.Mesh(geom, mat);
  if (isHeart) mesh.scale.setScalar(30);
  scene.add(mesh);
  sparkles.push({
    mesh,
    angle: (i / SPARKLE_COUNT) * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.6,
    radiusX: 0,
    radiusY: 0,
    phase: Math.random() * Math.PI * 2,
  });
}

// --- Screen to world conversion ---
export function screenToWorld(sx, sy) {
  const ndcX = (sx / window.innerWidth) * 2 - 1;
  const ndcY = -(sy / window.innerHeight) * 2 + 1;
  const vec = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
  const dir = vec.sub(camera.position).normalize();
  const dist = -camera.position.z / dir.z;
  return camera.position.clone().add(dir.multiplyScalar(dist));
}

// --- Get card center in world coords ---
function getCardWorld() {
  const el = document.getElementById('syllable-card');
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0) return null;
  const center = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
  const edge = screenToWorld(rect.left + rect.width, rect.top + rect.height / 2);
  const halfW = Math.abs(edge.x - center.x) + 100;
  const halfH = halfW * (rect.height / rect.width) + 60;
  return { center, halfW, halfH };
}

// --- Update loop ---
export function updateSpace(t, dt) {
  stars.rotation.y = t * 0.008;
  stars.rotation.x = Math.sin(t * 0.003) * 0.05;

  nebulae.forEach(n => {
    n.mesh.rotation.z += n.speed * dt;
    n.mesh.position.x += Math.sin(t * 0.3 + n.phase) * 0.3;
    n.mesh.position.y += Math.cos(t * 0.2 + n.phase) * 0.2;
  });

  if (dimTimer > 0) {
    dimTimer -= dt * 1000;
    if (dimTimer <= 0) dimTarget = 1;
  }
  dimCurrent += (dimTarget - dimCurrent) * Math.min(dt * 5, 1);

  const card = getCardWorld();
  sparkles.forEach(s => {
    if (card) {
      s.radiusX = card.halfW;
      s.radiusY = card.halfH;
      const a = s.angle + t * s.speed;
      s.mesh.position.x = card.center.x + Math.cos(a) * s.radiusX;
      s.mesh.position.y = card.center.y + Math.sin(a) * s.radiusY * 0.85;
      s.mesh.position.z = 10;
      const pulse = 0.5 + 0.5 * Math.sin(t * 3 + s.phase);
      s.mesh.scale.setScalar(s.mesh.geometry === heartGeomExtruded ? (15 + pulse * 15) : (0.4 + pulse * 0.6));
      s.mesh.material.opacity = dimCurrent * (0.3 + pulse * 0.5);
      s.mesh.rotation.x = t * 2 + s.phase;
      s.mesh.rotation.y = t * 1.5;
      s.mesh.rotation.z = Math.sin(t + s.phase) * 0.3;
    } else {
      s.mesh.material.opacity = 0;
    }
  });
}

export function dim(ms) {
  dimTarget = 0.15;
  dimTimer = ms;
}
