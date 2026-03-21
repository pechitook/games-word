import { THREE, scene } from './engine.js';

const PALETTE = [0xFF6BB5, 0xFF1493, 0xFF69B4, 0xFF85C8, 0xC46BFF, 0xFFD93D, 0xFF9B45];
const PINK_SHADES = [0xFF6BB5, 0xFF1493, 0xFF69B4, 0xFF85C8, 0xFFB6D9, 0xFF3399];
const alive = [];

// --- Heart geometry ---
function createHeartGeometry(size) {
  const s = size || 1;
  const shape = new THREE.Shape();
  shape.moveTo(0, -s * 0.6);
  shape.bezierCurveTo(0, -s * 0.9, -s * 0.85, -s * 0.95, -s * 0.85, -s * 0.35);
  shape.bezierCurveTo(-s * 0.85, s * 0.15, -s * 0.45, s * 0.55, 0, s * 0.9);
  shape.bezierCurveTo(s * 0.45, s * 0.55, s * 0.85, s * 0.15, s * 0.85, -s * 0.35);
  shape.bezierCurveTo(s * 0.85, -s * 0.95, 0, -s * 0.9, 0, -s * 0.6);
  return new THREE.ExtrudeGeometry(shape, { depth: s * 0.3, bevelEnabled: true, bevelThickness: s * 0.05, bevelSize: s * 0.05, bevelSegments: 2 });
}

const heartGeom = createHeartGeometry(5);

function randomPink() {
  return PINK_SHADES[Math.floor(Math.random() * PINK_SHADES.length)];
}

function randomPalette() {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

export function spawnBurst(origin) {
  const count = 50;
  for (let i = 0; i < count; i++) {
    const color = i < count * 0.7 ? randomPink() : randomPalette();
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(heartGeom, mat);
    mesh.position.copy(origin);
    mesh.scale.setScalar(0.6 + Math.random() * 0.5);

    const angle = Math.random() * Math.PI * 2;
    const speed = 150 + Math.random() * 200;
    const upBias = 80 + Math.random() * 120;
    mesh.userData.vel = new THREE.Vector3(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed * 0.5 + upBias,
      (Math.random() - 0.5) * 60
    );
    mesh.userData.rotSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 6
    );
    mesh.userData.life = 1.2 + Math.random() * 0.5;
    mesh.userData.maxLife = mesh.userData.life;
    mesh.userData.gravity = 250;

    scene.add(mesh);
    alive.push(mesh);
  }
}

export function spawnConfetti3D(origin) {
  const count = 80;
  for (let i = 0; i < count; i++) {
    const color = i < count * 0.6 ? randomPink() : randomPalette();
    const useHeart = Math.random() > 0.4;
    const geom = useHeart ? heartGeom : new THREE.BoxGeometry(5, 5, 5);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geom, mat);
    if (useHeart) {
      mesh.scale.setScalar(0.4 + Math.random() * 0.4);
    } else {
      mesh.scale.set(0.4 + Math.random() * 0.4, 0.8 + Math.random() * 0.3, 0.2);
    }
    mesh.position.set(
      origin.x + (Math.random() - 0.5) * 300,
      origin.y + 150 + Math.random() * 200,
      origin.z + (Math.random() - 0.5) * 50
    );

    mesh.userData.vel = new THREE.Vector3(
      (Math.random() - 0.5) * 80,
      -(60 + Math.random() * 100),
      (Math.random() - 0.5) * 40
    );
    mesh.userData.rotSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    mesh.userData.life = 2.5 + Math.random() * 1.5;
    mesh.userData.maxLife = mesh.userData.life;
    mesh.userData.gravity = 350;

    scene.add(mesh);
    alive.push(mesh);
  }
}

export function updateParticles(dt) {
  for (let i = alive.length - 1; i >= 0; i--) {
    const p = alive[i];
    p.userData.life -= dt;
    if (p.userData.life <= 0) {
      scene.remove(p);
      p.material.dispose();
      alive.splice(i, 1);
      continue;
    }
    const ratio = p.userData.life / p.userData.maxLife;
    p.userData.vel.y -= p.userData.gravity * dt;
    p.position.addScaledVector(p.userData.vel, dt);
    p.rotation.x += p.userData.rotSpeed.x * dt;
    p.rotation.y += p.userData.rotSpeed.y * dt;
    p.rotation.z += p.userData.rotSpeed.z * dt;
    p.material.opacity = Math.min(1, ratio * 2);
    p.scale.multiplyScalar(0.998);
  }
}
