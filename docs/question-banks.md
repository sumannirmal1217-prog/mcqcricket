# Question bank format (version 1)

A bank has `schemaVersion: 1`, a stable `id`, and a nonempty `questions` array. Optional bank metadata: `title`, `language` (BCP 47 tag). Each question requires:

| Field | Meaning |
| --- | --- |
| `id` | Unique stable string within the bank |
| `prompt` | Nonempty plain text |
| `topic` | Nonempty topic key, used for filtering |
| `difficulty` | `easy`, `medium`, or `hard` |
| `options` | At least two objects with unique `id` and nonempty `text` |
| `correctOptionId` | ID of exactly one option |
| `explanation` | Plain text shown during review |

See `data/question-banks/sample.en.json` for a complete example. Use globally unique question IDs when combining banks. Keep IDs stable when correcting wording; version banks when changing answers. Future metadata may include subject, class, curriculum, source references and translations. Review content accuracy and rights before release. Do not put HTML in prompts.

Answers are a map of question ID to selected option ID. Missing/null answers are unanswered. Unknown question or option IDs are rejected. Accuracy uses all questions as the denominator. Wickets currently do not end an innings; early termination and overs belong to a future game-rules layer.
