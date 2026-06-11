import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlayer } from "@/lib/current-player";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — FIFA Fantasy" }] }),
  component: Leaderboard,
});

type Row = {
  player_id: string;
  name: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  not_played: number;
  picks: number;
};

function Leaderboard() {
  const me = useCurrentPlayer();
  const q = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const [players, picks, matches, settingsRes] = await Promise.all([
        supabase.from("players").select("id,name"),
        supabase.from("picks").select("player_id,match_id,picked"),
        supabase.from("matches").select("id,status,result"),
        supabase.from("scoring_settings").select("*").eq("id", 1).single(),
      ]);
      if (players.error) throw players.error;
      const s = settingsRes.data ?? {
        win_points: 3,
        draw_points: 1,
        loss_points: -1,
        not_played_points: 0,
        max_not_played: 2,
      };
      const matchById = new Map(matches.data?.map((m) => [m.id, m]));
      const rows = new Map<string, Row>();
      players.data?.forEach((p) =>
        rows.set(p.id, {
          player_id: p.id,
          name: p.name,
          points: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          not_played: 0,
          picks: 0,
        }),
      );
      picks.data?.forEach((pk) => {
        const r = rows.get(pk.player_id);
        const m = matchById.get(pk.match_id);
        if (!r || !m) return;
        r.picks++;
        if (m.status === "not_played") {
          if (r.not_played < s.max_not_played) {
            r.not_played++;
            r.points += s.not_played_points;
          }
          return;
        }
        if (m.status !== "played" || !m.result) return;
        if (m.result === "draw") {
          r.draws++;
          r.points += s.draw_points;
        } else if (m.result === pk.picked) {
          r.wins++;
          r.points += s.win_points;
        } else {
          r.losses++;
          r.points += s.loss_points;
        }
      });
      return Array.from(rows.values()).sort((a, b) => b.points - a.points || b.wins - a.wins);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-4xl">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Live standings across all played matches.</p>
      </div>

      {q.data && q.data.length >= 1 && (
        <div className="grid sm:grid-cols-3 gap-3">
          {q.data.slice(0, 3).map((r, i) => (
            <div
              key={r.player_id}
              className={`rounded-2xl border p-5 ${i === 0 ? "border-neon bg-neon/10 glow-neon" : "border-border bg-card"}`}
            >
              <div className="display text-5xl text-neon">#{i + 1}</div>
              <div className="display text-2xl mt-1 truncate">{r.name}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                {r.points} pts · {r.wins}W {r.draws}D {r.losses}L
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-right">Pts</th>
              <th className="px-4 py-3 text-right">W</th>
              <th className="px-4 py-3 text-right">D</th>
              <th className="px-4 py-3 text-right">L</th>
              <th className="px-4 py-3 text-right">NP</th>
              <th className="px-4 py-3 text-right">Picks</th>
            </tr>
          </thead>
          <tbody>
            {q.data?.map((r, i) => (
              <tr
                key={r.player_id}
                className={`border-t border-border ${me?.id === r.player_id ? "bg-neon/5" : ""}`}
              >
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 font-medium">
                  {r.name}
                  {me?.id === r.player_id && <span className="ml-2 text-xs text-neon">you</span>}
                </td>
                <td className="px-4 py-3 text-right display text-xl text-neon">{r.points}</td>
                <td className="px-4 py-3 text-right">{r.wins}</td>
                <td className="px-4 py-3 text-right">{r.draws}</td>
                <td className="px-4 py-3 text-right">{r.losses}</td>
                <td className="px-4 py-3 text-right">{r.not_played}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{r.picks}</td>
              </tr>
            ))}
            {q.data?.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No players yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
