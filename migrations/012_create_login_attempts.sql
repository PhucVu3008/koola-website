-- Migration: Create login_attempts table for IP blocking
-- Purpose: Track failed login attempts to implement IP blocking after X failed attempts
-- Security: Block IP for 30 seconds after 5 failed login attempts within 5 minutes

CREATE TABLE IF NOT EXISTS login_attempts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  
  -- Composite index for efficient lookups
  -- Used in: "get failed attempts in last N minutes for this IP"
  CONSTRAINT login_attempts_email_check CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$')
);

-- Index for IP-based queries (most common: check if IP is blocked)
CREATE INDEX idx_login_attempts_ip_time 
  ON login_attempts(ip_address, attempted_at DESC);

-- Index for email-based queries (admin analytics)
CREATE INDEX idx_login_attempts_email_time 
  ON login_attempts(email, attempted_at DESC);

-- Index for cleanup queries (delete old attempts)
CREATE INDEX idx_login_attempts_attempted_at 
  ON login_attempts(attempted_at);

-- Comments for documentation
COMMENT ON TABLE login_attempts IS 'Tracks all login attempts (success + failure) for security monitoring and IP blocking';
COMMENT ON COLUMN login_attempts.email IS 'Email used in login attempt (even if user does not exist)';
COMMENT ON COLUMN login_attempts.ip_address IS 'IPv4 or IPv6 address of the client';
COMMENT ON COLUMN login_attempts.user_agent IS 'Browser/client user agent for forensics';
COMMENT ON COLUMN login_attempts.success IS 'true = successful login, false = failed (wrong password, user not found, etc)';
COMMENT ON COLUMN login_attempts.failure_reason IS 'Why login failed: INVALID_EMAIL, INVALID_PASSWORD, USER_INACTIVE, IP_BLOCKED';
