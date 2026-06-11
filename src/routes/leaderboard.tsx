import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlayer } from "@/lib/current-player";
import { toast } from "sonner";
import { Pencil, Check, X } from "lucide-react";

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
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const updateNameMut = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("players").update({ name: name.trim() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Name updated successfully");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

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
                  {editingId === r.player_id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-input border border-border rounded px-2 py-1 text-sm w-32"
                        autoFocus
                      />
                      <button 
                        onClick={() => {
                          if (editName.trim()) {
                            updateNameMut.mutate({ id: r.player_id, name: editName });
                          }
                        }} 
                        disabled={updateNameMut.isPending}
                        className="text-neon hover:opacity-80"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:opacity-80">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <span>{r.name}</span>
                      {me?.id === r.player_id && <span className="text-xs text-neon">you</span>}
                      {me?.name === "Abir" && (
                        <button
                          onClick={() => {
                            setEditingId(r.player_id);
                            setEditName(r.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-neon transition-all"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
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
