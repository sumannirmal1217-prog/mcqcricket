# Initial development milestones

## M0 — Starter (implemented)
- [x] Subject-independent JSON question format and runtime validation.
- [x] Quiz filtering, optional shuffle and configurable runs/wickets scoring.
- [x] Browser quiz, scorecard, answer review and restart.
- [x] Core tests, bank validation, local server and CI definition.

## M1 — Content and game rules
- [ ] Confirm audience, subjects, bank sizes and whether cricket is a theme or quiz subject.
- [ ] Approve runs, wickets, overs, time limits and innings-end rules.
- [ ] Add reviewed topic banks, provenance and language metadata.
- [ ] Add topic selection and configurable quiz length to the UI.
Acceptance: reviewed banks pass validation; selected topic and approved rules produce repeatable results.

## M2 — Trusted attempts and persistence
- [ ] Add server-side question delivery/grading and database migrations.
- [ ] Add user authentication, attempt ownership and submission idempotency.
- [ ] Record bank/rules versions and attempt history.
Acceptance: answers are absent from pre-submit client payloads; duplicate submissions cannot double-count scores; users cannot access other users' attempts.

## M3 — WordPress / LMS integration
- [ ] Choose standalone embed or native plugin delivery.
- [ ] Implement WordPress adapter and authenticated user mapping.
- [ ] Verify the chosen LMS grade/completion contract before implementing an adapter.
Acceptance: test-site launch and result sync work with retries and no duplicate completions.

## M4 — Release readiness
- [ ] Add keyboard/mobile browser checks and browser automation.
- [ ] Add monitoring, backups, content import tooling and deployment configuration.
- [ ] Decide license, privacy policy and retention rules.
Acceptance: agreed browser checks pass and a staging release can be restored from backup.
