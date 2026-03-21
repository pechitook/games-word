function buildBackground() {
  const starsEl = document.getElementById('stars');
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 3 + 1;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      --d:${(Math.random()*3+1).toFixed(1)}s;
      animation-delay:${(Math.random()*3).toFixed(1)}s;
    `;
    starsEl.appendChild(s);
  }
  const bubblesEl = document.getElementById('bubbles');
  const colors = ['#FF6BB5','#FFD93D','#6BCBFF','#C46BFF','#6BFF9E','#FF9B45'];
  for (let i = 0; i < 8; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.random() * 200 + 100;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background:${colors[i % colors.length]};
      --d:${(Math.random()*6+4).toFixed(1)}s;
    `;
    bubblesEl.appendChild(b);
  }
}
