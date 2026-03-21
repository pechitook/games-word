function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById('mic-text').textContent = '⚠️ Tu navegador no soporta voz';
    return null;
  }

  const rec = new SpeechRecognition();
  rec.lang = 'es-MX';
  rec.continuous = false;
  rec.interimResults = true;
  rec.maxAlternatives = 5;

  rec.onstart = () => {
    setMicStatus('listening', '🎤 Escuchando...');
  };

  rec.onresult = (event) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript.trim().toLowerCase();
      if (event.results[i].isFinal) final = t;
      else interim = t;
    }
    const heard = (final || interim).toLowerCase().trim();
    if (heard) {
      setMicStatus('heard', `🔊 Escuché: "${heard}"`);
      document.getElementById('heard-text').textContent = `"${heard}"`;
      checkAnswer(heard);
    }
  };

  rec.onerror = (e) => {
    if (e.error !== 'no-speech' && e.error !== 'aborted') {
      setMicStatus('idle', '🎤 Toca para escuchar');
    }
  };

  rec.onend = () => {
    if (gameActive) {
      setTimeout(() => {
        if (gameActive) {
          try { rec.start(); } catch(e) {}
        }
      }, 200);
    }
  };

  return rec;
}
