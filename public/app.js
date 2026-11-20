const sentenceInput = document.querySelector('#sentence');
const practiceInput = document.querySelector('#practice');
const askButton = document.querySelector('#ask-button');
const answer = document.querySelector('#answer');
const status = document.querySelector('#status');
const saveButton = document.querySelector('#save-button');
const saveStatus = document.querySelector('#save-status');
const themeButton = document.querySelector('#theme-button');

function setTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  themeButton.textContent = dark ? '☀️ Light mode' : '🌙 Dark mode';
  themeButton.setAttribute('aria-pressed', String(dark));
  localStorage.setItem('grammar-helper-theme', dark ? 'dark' : 'light');
}

themeButton.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-mode')));
setTheme(localStorage.getItem('grammar-helper-theme') === 'dark');

function renderSamples() {
  document.querySelector('#samples').innerHTML = GrammarStorage.loadSamples().map(item => `<div class="sample"><strong>${escapeHtml(item.sentence)}</strong><span>${escapeHtml(item.note)}</span></div>`).join('');
}

function escapeHtml(value) { return value.replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char])); }

askButton.addEventListener('click', async () => {
  const sentence = sentenceInput.value.trim();
  if (!sentence) { status.textContent = 'Please paste a sentence first.'; sentenceInput.focus(); return; }
  askButton.disabled = true; status.textContent = 'Thinking…'; answer.hidden = true;
  try {
    const response = await fetch('/api/grammar', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ sentence }) });
    const data = await response.json();
    if (!response.ok) throw new Error(typeof data.error === 'object' ? data.error.message : data.error);
    answer.textContent = data.answer; answer.hidden = false; status.textContent = 'Here is your explanation.';
  } catch (error) { status.textContent = error.message || 'I cannot answer right now. Please check the key.'; }
  finally { askButton.disabled = false; }
});

saveButton.addEventListener('click', () => {
  const practice = practiceInput.value.trim();
  if (!practice) { saveStatus.textContent = 'Write a practice answer first.'; return; }
  GrammarStorage.saveSample(practice); renderSamples(); practiceInput.value = ''; saveStatus.textContent = 'Saved in this browser.';
});

renderSamples();
