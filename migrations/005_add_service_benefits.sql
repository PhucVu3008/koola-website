-- Migration: Add service_benefits table
-- Date: 2026-01-20
-- Purpose: Store key benefits for each service (separate from deliverables)

CREATE TABLE IF NOT EXISTS service_benefits (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100), -- Icon identifier (e.g., 'Zap', 'Shield', 'TrendingUp')
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_service_benefits_service_id ON service_benefits(service_id);
CREATE INDEX idx_service_benefits_sort_order ON service_benefits(service_id, sort_order);

-- Comments
COMMENT ON TABLE service_benefits IS 'Key benefits/value propositions for each service (shown in Key Benefits section)';
COMMENT ON COLUMN service_benefits.icon_name IS 'Lucide icon name for visual representation';
