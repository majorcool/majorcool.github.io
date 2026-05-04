async function includeSections() {
  const nodes = [...document.querySelectorAll('[data-include]')];
  await Promise.all(nodes.map(async node => {
    const response = await fetch(node.dataset.include);
    node.outerHTML = await response.text();
  }));
}

function renderLevel(level = 'beginner') {
  const data = window.STRENGTH_DATA.levels[level];
  const panel = document.querySelector('#levelPanel');
  if (!panel || !data) return;
  panel.innerHTML = `<h3>${data.title}</h3><ul>${data.focus.map(item => `<li>${item}</li>`).join('')}</ul><p>${data.prescription}</p>`;
  document.querySelectorAll('[data-level]').forEach(btn => btn.classList.toggle('active', btn.dataset.level === level));
}

function renderExercises() {
  const grid = document.querySelector('#exerciseGrid');
  if (!grid) return;
  grid.innerHTML = window.STRENGTH_DATA.exercises.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('');
}

function renderPlan() {
  const goal = document.querySelector('#goalSelect')?.value || 'health';
  const days = document.querySelector('#dayRange')?.value || '3';
  const output = document.querySelector('#planOutput');
  const dayValue = document.querySelector('#dayValue');
  if (dayValue) dayValue.textContent = `${days} 天`;
  if (!output) return;
  output.innerHTML = `<h3>${days} 天周计划建议</h3><ol>${window.STRENGTH_DATA.plans[goal].map(item => `<li>${item}</li>`).join('')}</ol><p>执行标准：动作无明显疼痛，最后一组仍能保持技术；连续两周轻松完成上限次数后再加重量。</p>`;
}

function bindInteractions() {
  document.querySelectorAll('[data-level]').forEach(btn => btn.addEventListener('click', () => renderLevel(btn.dataset.level)));
  document.querySelector('#goalSelect')?.addEventListener('change', renderPlan);
  document.querySelector('#dayRange')?.addEventListener('input', renderPlan);
}

includeSections().then(() => {
  renderLevel();
  renderExercises();
  renderPlan();
  bindInteractions();
});
