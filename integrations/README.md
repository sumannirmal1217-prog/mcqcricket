# Future adapters

No integration is implemented yet. Keep platform code here rather than adding platform dependencies to `packages/core`.

- `wordpress/`: future plugin/shortcode or embed adapter, authenticated user mapping and server-side bank/attempt storage.
- `lms/`: future course/activity mapping, result conversion and completion sync.

For Edunovations, LearnPress can be evaluated here once its installed version and grading contract are confirmed. Use authenticated server calls, least-privilege authorization and idempotent result sync. Never place WordPress credentials in browser assets. Implement and test adapters against a staging site first.
