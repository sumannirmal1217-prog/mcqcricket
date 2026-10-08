# Architecture and integration boundaries

`apps/web` imports the pure JavaScript core and loads a JSON bank. The core owns validation, selection and scoring. It has no DOM, network, database or WordPress dependency. Question selection supports an injected random source for repeatable tests. Selected questions are copied so UI edits cannot mutate the bank.

For production, introduce a server API that persists attempts and owns answer keys. A start endpoint should return an attempt ID, bank version and public questions with no correct answers/explanations. A submission endpoint should accept the attempt ID plus selected option IDs, retrieve its fixed question set, grade once and save the result. Never trust client-supplied scores or question sets. Define retry/idempotency, authentication, authorization and attempt limits before use.

Keep a repository adapter for bank and attempt storage. Add integrations behind adapters that translate external identifiers to stable bank, question, user and attempt IDs. The scorecard should retain rules and bank versions for auditability. The current core score is a practice result, not an LMS grade contract.

The development server serves only web assets, core modules and question banks. It does not expose project documents or environment files. Browser rendering uses textContent to display question content as text.
