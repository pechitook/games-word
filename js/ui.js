function showScreen(name) {
  ['start','game','result'].forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    el.style.display = (s === name) ? 'flex' : 'none';
  });
}

function buildProgressDots() {
  const el = document.getElementById('progress-dots');
  el.innerHTML = '';
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' current' : '');
    d.id = `dot-${i}`;
    el.appendChild(d);
  }
}

function updateDot(index, state) {
  const d = document.getElementById(`dot-${index}`);
  if (!d) return;
  d.className = 'dot ' + state;
}

function setMicStatus(state, text) {
  const dot = document.getElementById('mic-dot');
  const txt = document.getElementById('mic-text');
  dot.className = 'mic-dot' + (state !== 'idle' ? ' ' + state : '');
  txt.textContent = text;
}

function launchEmoji(emoji) {
  const el = document.createElement('div');
  el.className = 'feedback-emoji';
  el.textContent = emoji;
  el.style.left = (Math.random() * 60 + 20) + '%';
  el.style.top = '40%';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function launchConfetti() {
  const colors = ['#FF6BB5','#FFD93D','#6BCBFF','#C46BFF','#6BFF9E','#FF9B45'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random()*100}%;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      --d: ${(Math.random()*2+1).toFixed(1)}s;
      --delay: ${(Math.random()*0.5).toFixed(2)}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}
