CREATE TABLE IF NOT EXISTS feedback (
 id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE, request_hash TEXT NOT NULL,
 tool_id TEXT NOT NULL, version TEXT NOT NULL, locale TEXT NOT NULL,
 type TEXT NOT NULL, nickname TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, email TEXT NOT NULL DEFAULT '',
 public_opt_in INTEGER NOT NULL DEFAULT 0, moderation TEXT NOT NULL DEFAULT 'pending', state TEXT NOT NULL DEFAULT 'received',
 public_title TEXT NOT NULL DEFAULT '', public_body TEXT NOT NULL DEFAULT '', public_nickname TEXT NOT NULL DEFAULT '', public_reply TEXT NOT NULL DEFAULT '',
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS feedback_public ON feedback(tool_id,moderation,public_opt_in,created_at DESC,id DESC);
CREATE INDEX IF NOT EXISTS feedback_moderation ON feedback(moderation,created_at DESC);
CREATE TABLE IF NOT EXISTS feedback_audit (id INTEGER PRIMARY KEY, feedback_id TEXT NOT NULL, actor TEXT NOT NULL, action TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS rate_expiry ON rate_limits(expires_at);
