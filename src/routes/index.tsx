import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlayer, setCurrentPlayer } from "@/lib/current-player";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FIFA Fantasy Picks — 48 teams, 104 matches" },
      { name: "description", content: "Pick winners, score points, top the leaderboard." },
    ],
  }),
  component: Index,
});

function Index() {
  const player = useCurrentPlayer();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const stats = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const [matches, players] = await Promise.all([
        supabase.from("matches").select("id,status", { count: "exact", head: false }),
        supabase.from("players").select("id", { count: "exact", head: true }),
      ]);
      const total = matches.data?.length ?? 0;
      const played =
        matches.data?.filter((m) => m.status === "played" || m.status === "not_played").length ?? 0;
      return { total, played, players: players.count ?? 0 };
    },
  });

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      // Try to find existing player by name (case-insensitive)
      const { data: existing } = await supabase
        .from("players")
        .select("id,name")
        .ilike("name", trimmed)
        .maybeSingle();

      let p = existing;
      if (!p) {
        const { data, error } = await supabase
          .from("players")
          .insert({ name: trimmed })
          .select("id,name")
          .single();
        if (error) throw error;
        p = data;
      }
      setCurrentPlayer({ id: p!.id, name: p!.name });
      toast.success(`Welcome, ${p!.name}!`);
      navigate({ to: "/matches" });
    } catch (err: any) {
      toast.error(err.message ?? "Could not join");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-12 glow-neon">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(600px circle at 80% 0%, var(--neon) 0%, transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs uppercase tracking-widest text-neon">
            48 Teams · 104 Matches
          </div>
          <h1 className="display mt-4 text-5xl sm:text-7xl leading-none">
            Pick the winners.
            <br />
            <span className="text-neon">Top the table.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            A friendly fantasy league for the FIFA tournament. No squads, no transfers — just pick
            which team wins each match.
          </p>

          {player ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/matches"
                className="rounded-md bg-neon px-5 py-3 font-semibold text-primary-foreground glow-neon"
              >
                Go to Matches
              </Link>
              <Link
                to="/leaderboard"
                className="rounded-md border border-border px-5 py-3 font-semibold hover:bg-secondary"
              >
                Leaderboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                className="flex-1 rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={40}
                required
              />
              <button
                disabled={loading}
                className="rounded-md bg-neon px-5 py-3 font-semibold text-primary-foreground glow-neon disabled:opacity-60"
              >
                {loading ? "Joining…" : "Join Game"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Matches" value={`${stats.data?.total ?? 0} / 104`} />
        <StatCard label="Played" value={String(stats.data?.played ?? 0)} />
        <StatCard label="Players" value={String(stats.data?.players ?? 0)} />
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="display text-3xl">How scoring works</h2>
        <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          <ScoringRow tag="WIN" desc="Your picked team wins" value="+3" />
          <ScoringRow tag="DRAW" desc="Match ends in a draw" value="+1" />
          <ScoringRow tag="LOSS" desc="Your picked team loses" value="−1" />
          <ScoringRow tag="NOT PLAYED" desc="Match abandoned (max 2 per player)" value="0" />
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Values are configurable in Scoring settings.
        </p>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="display text-4xl mt-2 text-neon">{value}</div>
    </div>
  );
}

function ScoringRow({ tag, desc, value }: { tag: string; desc: string; value: string }) {
  return (
    <li className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-4 py-3">
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{tag}</div>
        <div className="text-sm">{desc}</div>
      </div>
      <div className="display text-2xl text-neon">{value}</div>
    </li>
  );
}
