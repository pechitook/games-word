import { renderer, scene, camera, clock } from './engine.js';
import { updateSpace, screenToWorld, dim } from './space.js';
import { spawnBurst, spawnConfetti3D, updateParticles } from './particles.js';

// --- Render loop ---
let lastTime = 0;
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const dt = Math.min(t - lastTime, 0.05);
  lastTime = t;
  updateSpace(t, dt);
  updateParticles(dt);
  renderer.render(scene, camera);
}
animate();

// --- Game logic ---
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function startGame() {
  syllables = shuffle(SYLLABLES_POOL).slice(0, TOTAL_ROUNDS);
  currentIndex = 0;
  score = 0;
  results = [];
  gameActive = true;

  buildProgressDots();
  showScreen('game');

  document.getElementById('total-num').textContent = TOTAL_ROUNDS;
  document.getElementById('score').textContent = '0';

  recognition = setupRecognition();
  if (recognition) {
    try { recognition.start(); } catch(e) {}
  }

  showSyllable();
}

function showSyllable() {
  if (currentIndex >= TOTAL_ROUNDS) { endGame(); return; }

  roundResolved = false;
  roundToken++;

  const syl = syllables[currentIndex];
  document.getElementById('syllable-display').textContent = syl;
  document.getElementById('current-num').textContent = currentIndex + 1;
  document.getElementById('heard-text').textContent = '';
  setMicStatus('listening', '🎤 Escuchando...');

  const card = document.getElementById('syllable-card');
  card.className = `syllable-card card-bg-${currentIndex % 5}`;

  const txt = document.getElementById('syllable-display');
  txt.style.transform = 'scale(0) rotate(-10deg)';
  txt.style.opacity = '0';
  setTimeout(() => {
    txt.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s';
    txt.style.transform = 'scale(1) rotate(0deg)';
    txt.style.opacity = '1';
  }, 50);

  updateDot(currentIndex, 'current');
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_PER_SYLLABLE;
  const bar = document.getElementById('timer-bar');
  bar.style.width = '100%';
  bar.className = 'timer-bar';

  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    const pct = Math.max(0, (timeLeft / TIME_PER_SYLLABLE) * 100);
    bar.style.width = pct + '%';

    if (pct < 30) bar.classList.add('urgent');

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleResult(false, 'timeout');
    }
  }, 100);
}

function checkAnswer(heard) {
  if (!gameActive || roundResolved || currentIndex >= TOTAL_ROUNDS) return;

  const target = syllables[currentIndex].toLowerCase();

  const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const heardNorm = normalize(heard);
  const targetNorm = normalize(target);

  if (heardNorm === targetNorm || heardNorm.includes(targetNorm) || heardNorm.startsWith(targetNorm)) {
    handleResult(true);
  }
}
window.checkAnswer = checkAnswer;

function handleResult(correct, reason) {
  if (!gameActive || roundResolved || currentIndex >= TOTAL_ROUNDS) return;
  roundResolved = true;
  const thisRoundToken = roundToken;

  clearInterval(timerInterval);

  const syl = syllables[currentIndex];
  results.push({ syllable: syl, ok: correct });

  const card = document.getElementById('syllable-card');

  // 3D particle origin from card center
  const rect = card.getBoundingClientRect();
  const origin = screenToWorld(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2
  );

  if (correct) {
    score++;
    document.getElementById('score').textContent = score;
    card.classList.add('correct');
    updateDot(currentIndex, 'done-ok');
    launchEmoji(['💖','💗','💕','✨','🎉','💫'][Math.floor(Math.random()*6)]);
    spawnBurst(origin);
    if (score % 5 === 0 && score > 0) spawnConfetti3D(origin);
  } else {
    card.classList.add('wrong');
    updateDot(currentIndex, 'done-fail');
    launchEmoji(['😅','💪','🔄','👀'][Math.floor(Math.random()*4)]);
    dim(500);
  }

  setTimeout(() => {
    if (!gameActive || thisRoundToken !== roundToken) return;

    card.classList.remove('correct','wrong');
    currentIndex++;
    if (currentIndex < TOTAL_ROUNDS) showSyllable();
    else endGame();
  }, 700);
}

function endGame() {
  gameActive = false;
  if (recognition) {
    try { recognition.stop(); recognition.abort(); } catch(e) {}
    recognition = null;
  }
  clearInterval(timerInterval);

  const pct = score / TOTAL_ROUNDS;
  let stars, title;

  if (pct === 1) {
    stars = '⭐⭐⭐⭐⭐'; title = '¡Perfecta, Roma! 🏆';
    launchConfetti(); setTimeout(launchConfetti, 600); setTimeout(launchConfetti, 1200);
    const center = screenToWorld(window.innerWidth / 2, window.innerHeight / 2);
    spawnConfetti3D(center);
    setTimeout(() => spawnConfetti3D(center), 600);
  } else if (pct >= 0.8) {
    stars = '⭐⭐⭐⭐'; title = '¡Qué bien lo hiciste! 🎉';
    launchConfetti();
    spawnConfetti3D(screenToWorld(window.innerWidth / 2, window.innerHeight / 2));
  } else if (pct >= 0.6) {
    stars = '⭐⭐⭐'; title = '¡Muy bien, sigue así! 💪';
  } else if (pct >= 0.4) {
    stars = '⭐⭐'; title = '¡Vas mejorando! 😊';
  } else {
    stars = '⭐'; title = '¡La próxima vez más! 🌈';
  }

  document.getElementById('result-stars').textContent = stars;
  document.getElementById('result-title').textContent = title;
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-total').textContent = TOTAL_ROUNDS;

  const grid = document.getElementById('result-grid');
  grid.innerHTML = '';
  results.forEach(r => {
    const el = document.createElement('div');
    el.className = `result-item ${r.ok ? 'ok' : 'fail'}`;
    el.textContent = r.syllable;
    const icon = document.createElement('span');
    icon.className = 'result-icon';
    icon.textContent = r.ok ? '✅' : '❌';
    el.appendChild(icon);
    grid.appendChild(el);
  });

  showScreen('result');
}

export function restartGame() {
  startGame();
}

window.startGame = startGame;
window.restartGame = restartGame;

// --- Init ---
showScreen('start');

(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
    document.getElementById('mic-text').textContent = '🎤 Micrófono listo';
  } catch (e) {
    document.getElementById('mic-text').textContent = '⚠️ Sin acceso al micrófono';
  }
})();
