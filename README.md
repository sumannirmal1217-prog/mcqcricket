# MCQ Cricket

A practical starter for multiple-choice quizzes with cricket-style scoring. The initial demo uses general knowledge and arithmetic; question banks are subject independent. Correct answers score runs, incorrect answers lose wickets, and unanswered questions score zero without losing a wicket. These are starter defaults, not finalized product rules.

## Run locally

Requires Node.js 22 or newer. No package installation is needed.

```sh
npm start
# Open http://localhost:3000
npm test
npm run check
```

Select an answer for each question, submit your innings, and review the score and explanations. Restart to play again. The demo keeps attempts in memory; refreshing clears them.

## Structure

| Path | Purpose |
| --- | --- |
| `apps/web/` | Browser UI and styling |
| `packages/core/` | Framework-independent validation, quiz selection and scoring |
| `data/question-banks/` | Versioned JSON question banks |
| `integrations/` | WordPress and LMS integration boundaries |
| `docs/` | Architecture, bank format and development milestones |
| `scripts/` | Local development server and bank checks |
| `tests/` | Core behavior and validation tests |
| `.github/workflows/` | Automated checks |

## Add questions

Edit or add JSON banks using the format in [docs/question-banks.md](docs/question-banks.md). Run `npm run check`. Point `apps/web/app.js` at the desired bank. Every question has stable option IDs and an explanation. Use `createQuiz(bank, { topic, limit, shuffle, rng })` to filter and select questions. Scoring is configurable via `scoreQuiz`.

## Extend the project

See [milestones](docs/milestones.md) and [architecture](docs/architecture.md). Keep scoring in the core package and persistence/authentication in adapters. A future API must grade on the server and send learners questions without answer keys.

## Current boundaries

This is a local development starter. Answer keys are visible in the browser, there is no login, database, timer, payments, leaderboard or live multiplayer, and no WordPress/LMS connection is implemented. Do not use the demo for trusted assessments. The local server binds to localhost and is not a production host. No deployment is configured.

No open-source license has been chosen yet. Choose one before inviting reuse outside the project.
