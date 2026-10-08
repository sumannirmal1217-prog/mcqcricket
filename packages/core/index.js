export function validateBank(bank) {
  if (!bank || bank.schemaVersion !== 1 || typeof bank.id !== 'string' || !bank.id.trim() || !Array.isArray(bank.questions) || !bank.questions.length) {
    throw new TypeError('Bank requires schemaVersion 1, an id and nonempty questions');
  }
  const ids = new Set();
  for (const q of bank.questions) {
    if (!q || typeof q.id !== 'string' || !q.id.trim() || ids.has(q.id)) throw new TypeError('Question IDs must be unique and nonempty');
    ids.add(q.id);
    for (const key of ['prompt', 'topic', 'explanation']) {
      if (typeof q[key] !== 'string' || !q[key].trim()) throw new TypeError(`${q.id}: missing ${key}`);
    }
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) throw new TypeError(`${q.id}: invalid difficulty`);
    if (!Array.isArray(q.options) || q.options.length < 2) throw new TypeError(`${q.id}: at least two options required`);
    const options = new Set();
    for (const option of q.options) {
      if (!option || typeof option.id !== 'string' || !option.id.trim() || options.has(option.id) || typeof option.text !== 'string' || !option.text.trim()) throw new TypeError(`${q.id}: invalid options`);
      options.add(option.id);
    }
    if (!options.has(q.correctOptionId)) throw new TypeError(`${q.id}: answer must reference an option`);
  }
  return bank;
}

export function createQuiz(bank, { topic, limit = bank.questions.length, shuffle = false, rng = Math.random } = {}) {
  validateBank(bank);
  if (!Number.isInteger(limit) || limit < 1) throw new TypeError('limit must be a positive integer');
  const selected = bank.questions.filter(q => !topic || q.topic === topic);
  if (shuffle) {
    for (let i = selected.length - 1; i > 0; i--) {
      const value = rng();
      if (!(value >= 0 && value < 1)) throw new TypeError('rng must return a value in [0, 1)');
      const j = Math.floor(value * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }
  }
  if (!selected.length) throw new RangeError('No questions match the selected topic');
  return { id: bank.id, schemaVersion: 1, questions: structuredClone(selected.slice(0, limit)) };
}

export function scoreQuiz(quiz, answers = {}, { runsPerCorrect = 4, wicketsPerIncorrect = 1 } = {}) {
  validateBank(quiz);
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) throw new TypeError('answers must map question IDs to option IDs');
  for (const value of [runsPerCorrect, wicketsPerIncorrect]) {
    if (!Number.isInteger(value) || value < 0) throw new TypeError('Scoring values must be nonnegative integers');
  }
  const known = new Set(quiz.questions.map(q => q.id));
  if (Object.keys(answers).some(id => !known.has(id))) throw new TypeError('Unknown question in answers');
  const review = quiz.questions.map(q => {
    const selectedOptionId = answers[q.id] ?? null;
    if (selectedOptionId !== null && !q.options.some(o => o.id === selectedOptionId)) throw new TypeError(`${q.id}: unknown selected option`);
    const status = selectedOptionId === null ? 'unanswered' : selectedOptionId === q.correctOptionId ? 'correct' : 'incorrect';
    return { questionId: q.id, selectedOptionId, correctOptionId: q.correctOptionId, status, explanation: q.explanation };
  });
  const correct = review.filter(r => r.status === 'correct').length;
  const incorrect = review.filter(r => r.status === 'incorrect').length;
  return { total: review.length, correct, incorrect, unanswered: review.length - correct - incorrect,
    runs: correct * runsPerCorrect, wickets: incorrect * wicketsPerIncorrect,
    accuracy: Math.round(correct / review.length * 100), review };
}
