ALTER TABLE feedback ADD COLUMN updated_by TEXT NOT NULL DEFAULT '';
CREATE TRIGGER feedback_update_audit AFTER UPDATE ON feedback BEGIN
 INSERT INTO feedback_audit(feedback_id,actor,action,created_at) VALUES(NEW.id,NEW.updated_by,json_object('revision',NEW.revision,'moderation',NEW.moderation,'state',NEW.state,'before',json_object('title',OLD.public_title,'body',OLD.public_body,'nickname',OLD.public_nickname,'reply',OLD.public_reply),'after',json_object('title',NEW.public_title,'body',NEW.public_body,'nickname',NEW.public_nickname,'reply',NEW.public_reply)),NEW.updated_at);
END;
