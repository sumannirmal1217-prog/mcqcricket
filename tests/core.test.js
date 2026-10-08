import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateBank, createQuiz, scoreQuiz } from '../packages/core/index.js';
const bank = JSON.parse(readFileSync(new URL('../data/question-banks/sample.en.json', import.meta.url)));
test('mixed answers score runs, wickets and unanswered accurately', () => {
  const quiz = createQuiz(bank, { limit: 3 });
  const result = scoreQuiz(quiz, { 'sample-001': 'c', 'sample-002': 'a' });
  assert.deepEqual([result.runs, result.wickets, result.correct, result.incorrect, result.unanswered, result.accuracy], [4, 1, 1, 1, 1, 33]);
  assert.equal(result.review[0].correctOptionId, 'c');
});
test('all correct, all wrong and unanswered outcomes', () => {
  const quiz = createQuiz(bank);
  assert.equal(scoreQuiz(quiz, Object.fromEntries(quiz.questions.map(q => [q.id, q.correctOptionId]))).runs, 20);
  assert.equal(scoreQuiz(quiz, Object.fromEntries(quiz.questions.map(q => [q.id, 'a']))).wickets, 5);
  assert.equal(scoreQuiz(quiz).unanswered, 5);
});
test('scoring rules are configurable and validated', () => {
  const quiz = createQuiz(bank, { limit: 1 });
  assert.equal(scoreQuiz(quiz, {'sample-001':'c'}, {runsPerCorrect:6}).runs, 6);
  assert.throws(() => scoreQuiz(quiz, {}, {runsPerCorrect:-1}));
  assert.throws(() => scoreQuiz(quiz, {'sample-001':'invalid'}));
  assert.throws(() => scoreQuiz(quiz, {unknown:'a'}));
});
test('filter, limit, reproducible shuffle and independent question copies', () => {
  const quiz = createQuiz(bank, {topic:'science',limit:1});
  assert.equal(quiz.questions.length, 1); assert.equal(quiz.questions[0].topic, 'science');
  quiz.questions[0].options[0].text = 'changed'; assert.notEqual(bank.questions[3].options[0].text, 'changed');
  const a = createQuiz(bank, {shuffle:true,rng:()=>0});
  assert.deepEqual(a, createQuiz(bank, {shuffle:true,rng:()=>0}));
  assert.notDeepEqual(a.questions.map(q=>q.id), bank.questions.map(q=>q.id));
  assert.throws(() => createQuiz(bank, {topic:'missing'}));
  assert.throws(() => createQuiz(bank, {limit:0}));
});
test('invalid bank structure and broken answer references are rejected', () => {
  for (const mutate of [b=>b.questions.push(b.questions[0]), b=>b.questions[0].correctOptionId='z', b=>b.questions[0].options[1].id='a', b=>b.questions=[], b=>b.questions[0].prompt='', b=>b.schemaVersion=2]) {
    const copy = structuredClone(bank); mutate(copy); assert.throws(() => validateBank(copy));
  }
});
