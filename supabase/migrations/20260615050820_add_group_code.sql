-- Add group_code to players table
ALTER TABLE players
  ADD COLUMN IF NOT EXISTS group_code text NOT NULL DEFAULT 'default';

-- Migrate all existing players to FIFA26
UPDATE players SET group_code = 'FIFA26';

CREATE INDEX IF NOT EXISTS players_group_code_idx ON players(group_code);
