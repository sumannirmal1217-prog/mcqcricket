import { createQuiz, scoreQuiz } from '../../packages/core/index.js';
const form = document.querySelector('#quiz');
const status = document.querySelector('#status');
const results = document.querySelector('#results');
const restart = document.querySelector('#restart');
let bank, quiz;
function element(tag, text) { const node = document.createElement(tag); node.textContent = text; return node; }
function start() {
  quiz = createQuiz(bank, { limit: 5, shuffle: true });
  form.replaceChildren();
  quiz.questions.forEach((q, index) => {
    const field = document.createElement('fieldset');
    field.append(element('legend', `${index + 1}. ${q.prompt}`));
    q.options.forEach(option => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio'; input.name = q.id; input.value = option.id;
      label.append(input, document.createTextNode(option.text)); field.append(label);
    });
    form.append(field);
  });
  const submit = element('button', 'Finish innings'); submit.type = 'submit'; form.append(submit);
  results.hidden = true; restart.hidden = true; form.hidden = false;
  status.textContent = `${quiz.questions.length} questions • Choose one answer per question.`;
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const score = scoreQuiz(quiz, Object.fromEntries(new FormData(form)));
  results.replaceChildren(element('h2', 'Your scorecard'), element('p', `${score.runs} runs / ${score.wickets} wickets`));
  results.children[1].className = 'score';
  results.append(element('p', `${score.correct} correct • ${score.incorrect} incorrect • ${score.unanswered} unanswered • ${score.accuracy}% of all questions correct`));
  score.review.forEach((item, index) => {
    const q = quiz.questions[index], article = document.createElement('article');
    article.append(element('h3', `${index + 1}. ${q.prompt}`), element('p', `Result: ${item.status}`), element('p', `Your answer: ${q.options.find(o => o.id === item.selectedOptionId)?.text ?? 'Unanswered'}`), element('p', `Correct answer: ${q.options.find(o => o.id === item.correctOptionId).text}`), element('p', item.explanation));
    results.append(article);
  });
  form.hidden = true; results.hidden = false; restart.hidden = false; status.textContent = 'Innings complete.'; results.focus();
});
restart.addEventListener('click', () => { start(); form.querySelector('input')?.focus(); });
try {
  const response = await fetch('../../data/question-banks/sample.en.json');
  if (!response.ok) throw new Error('Question bank could not be loaded');
  bank = await response.json(); start();
} catch (error) { status.textContent = `Unable to start: ${error.message}. Run npm start and reload.`; }
