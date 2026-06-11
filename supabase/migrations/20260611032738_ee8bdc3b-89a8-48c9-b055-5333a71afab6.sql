
-- Players (name-only accounts)
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX players_name_lower_idx ON public.players (lower(name));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.players TO anon, authenticated;
GRANT ALL ON public.players TO service_role;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "players open" ON public.players FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Matches
CREATE TYPE public.match_status AS ENUM ('scheduled', 'played', 'not_played');
CREATE TYPE public.match_result AS ENUM ('team_a', 'team_b', 'draw');

CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_a TEXT NOT NULL,
  team_b TEXT NOT NULL,
  team_a_stats TEXT,
  team_b_stats TEXT,
  description TEXT,
  kickoff_at TIMESTAMPTZ,
  status public.match_status NOT NULL DEFAULT 'scheduled',
  result public.match_result,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matches TO anon, authenticated;
GRANT ALL ON public.matches TO service_role;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches open" ON public.matches FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Picks
CREATE TYPE public.pick_team AS ENUM ('team_a', 'team_b');

CREATE TABLE public.picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  picked public.pick_team NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (player_id, match_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.picks TO anon, authenticated;
GRANT ALL ON public.picks TO service_role;
ALTER TABLE public.picks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "picks open" ON public.picks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Scoring settings (single row)
CREATE TABLE public.scoring_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  win_points INT NOT NULL DEFAULT 3,
  draw_points INT NOT NULL DEFAULT 1,
  loss_points INT NOT NULL DEFAULT -1,
  not_played_points INT NOT NULL DEFAULT 0,
  max_not_played INT NOT NULL DEFAULT 2,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.scoring_settings (id) VALUES (1);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scoring_settings TO anon, authenticated;
GRANT ALL ON public.scoring_settings TO service_role;
ALTER TABLE public.scoring_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scoring open" ON public.scoring_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_matches_updated BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_picks_updated BEFORE UPDATE ON public.picks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_scoring_updated BEFORE UPDATE ON public.scoring_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
