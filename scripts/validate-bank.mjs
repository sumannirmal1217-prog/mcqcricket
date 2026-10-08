import { readdir, readFile } from 'node:fs/promises';
import { validateBank } from '../packages/core/index.js';
const directory = new URL('../data/question-banks/', import.meta.url);
const names = (await readdir(directory)).filter(name => name.endsWith('.json'));
if (!names.length) throw new Error('No question banks found');
for (const name of names) {
  const bank = validateBank(JSON.parse(await readFile(new URL(name, directory), 'utf8')));
  console.log(`${name}: ${bank.questions.length} valid questions`);
}
