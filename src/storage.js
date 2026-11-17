const STORAGE_KEY = 'grammar-helper-samples';

const starterSamples = [
  { id: 'sample-1', sentence: 'She has been studying English for two years.', note: 'Present perfect continuous: an action started in the past and is still happening.' },
  { id: 'sample-2', sentence: 'Although it was raining, we walked to class.', note: 'Although introduces a contrast between two ideas.' }
];

function loadSamples() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) && saved.length ? saved : starterSamples;
  } catch { return starterSamples; }
}

function saveSample(sentence) {
  const samples = loadSamples();
  samples.unshift({ id: `sample-${Date.now()}`, sentence, note: 'Saved from your Grammar Helper practice.' });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(samples.slice(0, 10)));
}

window.GrammarStorage = { loadSamples, saveSample };
