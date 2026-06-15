-- Add is_admin column to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Update Abir to be admin for existing FIFA26 group
UPDATE players SET is_admin = true WHERE name = 'Abir' AND group_code = 'FIFA26';
