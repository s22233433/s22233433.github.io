# Tool feedback service

Production: `zhenguocool-tool-feedback`; isolated D1, no workers.dev or preview URLs.
Public calls arrive through the Pages `TOOL_FEEDBACK` service binding. The sole public Worker route is `staff.zhenguocool.com/tool-feedback*`, protected by existing Access and a verified owner JWT. No DNS or Access policy changes are required.

## Database setup

On a **new empty database**, apply `schema.sql`, then `002-audit.sql`, exactly once in that order. On the original baseline database, apply only `002-audit.sql` once. Do not replay an applied ALTER migration. Production already has both applied.

Run `node tests/tool-feedback.test.mjs` from the repository root; this covers a fresh database plus the migration and atomic audit rollback.

Secrets: `TURNSTILE_SECRET`, `RATE_SALT` via Wrangler secret storage only. `ENABLED=false` disables public reading and submissions without affecting tools. Owner-only administration remains available for moderation. No notification email or private-data retention deletion is enabled; expired rate-limit counters are removed on submission attempts.
