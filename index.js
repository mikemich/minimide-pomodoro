// Pomodoro for Minimide: click the timer (or press Mod-Alt-T) to start and pause.
export function activate(mide) {
  let phase = 'work'; // or 'break'
  let left = minutes('work') * 60;
  let timer = null;

  function minutes(p) { return mide.config.get(`pomodoro.${p}Minutes`, p === 'work' ? 25 : 5); }
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const item = mide.statusBar.addItem({ text: '', tooltip: 'Pomodoro: click to start or pause', align: 'right', onClick: toggle });
  const render = () => item.setText(`${phase === 'work' ? '🍅' : '☕'} ${fmt(left)}${timer ? '' : ' ⏸'}`);

  function tick() {
    left -= 1;
    if (left <= 0) {
      phase = phase === 'work' ? 'break' : 'work';
      left = minutes(phase) * 60;
      mide.notify.success(phase === 'break' ? 'Time for a break ☕' : 'Back to work 🍅', `${minutes(phase)} minutes`);
    }
    render();
  }
  function toggle() {
    if (timer) { clearInterval(timer); timer = null; } else timer = setInterval(tick, 1000);
    render();
  }
  function reset() {
    if (timer) clearInterval(timer);
    timer = null; phase = 'work'; left = minutes('work') * 60;
    render();
  }

  mide.commands.add({
    'pomodoro:toggle': { title: 'Start or Pause', run: toggle },
    'pomodoro:reset': { title: 'Reset', run: reset },
  });
  render();
  return { dispose: () => timer && clearInterval(timer) };
}
