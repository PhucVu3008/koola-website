-- Add 'manager' role and update permissions
-- Date: 2026-01-30

-- Insert manager role if not exists
INSERT INTO roles (id, name) VALUES 
  (3, 'manager')
ON CONFLICT (id) DO NOTHING;

-- Add description field to roles table for clarity
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS description text;

-- Update role descriptions
UPDATE roles SET description = 'Full access to all resources and user management' WHERE name = 'admin';
UPDATE roles SET description = 'Full access to content management, read-only access to user management' WHERE name = 'manager';
UPDATE roles SET description = 'Limited access to content editing only' WHERE name = 'editor';
