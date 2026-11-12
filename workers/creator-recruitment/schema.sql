-- Apply only to the existing website-forms D1 after release approval. No existing table is altered.
CREATE TABLE IF NOT EXISTS creator_applications (
 id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE, request_hash TEXT NOT NULL, email_key TEXT NOT NULL UNIQUE,
 name TEXT NOT NULL, email TEXT NOT NULL, region TEXT NOT NULL, live_experience TEXT NOT NULL,
 payload_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT '新申請' CHECK(status IN ('新申請','待聯繫','已聯繫','面談中','合作評估中','已錄取','不適合','已撤回')),
 internal_notes TEXT NOT NULL DEFAULT '', submitted_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 source_page TEXT NOT NULL, policy_version TEXT NOT NULL, privacy_consent INTEGER NOT NULL CHECK(privacy_consent=1),
 partner_sharing_consent INTEGER NOT NULL DEFAULT 0 CHECK(partner_sharing_consent=0), consent_at TEXT NOT NULL,
 expires_at TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0, updated_by TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS creator_filter ON creator_applications(status,submitted_at DESC);
CREATE INDEX IF NOT EXISTS creator_expiry ON creator_applications(expires_at);
CREATE TABLE IF NOT EXISTS creator_rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS creator_audit (id INTEGER PRIMARY KEY, application_id TEXT NOT NULL, action TEXT NOT NULL, actor TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TRIGGER IF NOT EXISTS creator_status_audit AFTER UPDATE ON creator_applications BEGIN
 INSERT INTO creator_audit(application_id,action,actor,created_at) VALUES(NEW.id,'update',NEW.updated_by,NEW.updated_at);
END;
-- Audit rows are deleted with the application; do not retain a second copy of applicant data.
CREATE TRIGGER IF NOT EXISTS creator_delete_audit AFTER DELETE ON creator_applications BEGIN
 DELETE FROM creator_audit WHERE application_id=OLD.id;
END;
