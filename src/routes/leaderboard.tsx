import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlayer } from "@/lib/current-player";
import { toast } from "sonner";
import { Pencil, Check, X, Copy, Share2 } from "lucide-react";

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
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [copied, setCopied] = useState(false);

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

  const makeAdminMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("players").update({ is_admin: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Player is now an admin");
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const q = useQuery({
    queryKey: ["leaderboard", me?.group_code],
    queryFn: async () => {
      if (!me?.group_code) return { knockout: [], group: [] };
      let matches = await supabase.from("matches").select("id,status,result,is_knockout,score_a,score_b");
      if (matches.error) {
        // Fallback for before the migration is run
        matches = await supabase.from("matches").select("id,status,result");
      }

      const [players, picks, settingsRes] = await Promise.all([
        supabase.from("players").select("id,name").eq("group_code", me.group_code),
        supabase.from("picks").select("player_id,match_id,picked,predicted_score_a,predicted_score_b"),
        supabase.from("scoring_settings").select("*").eq("id", 1).single(),
      ]);
      if (players.error) throw players.error;
      const s = settingsRes.data ?? {
        win_points: 3,
        draw_points: 1,
        loss_points: -1,
        not_played_points: 0,
        max_not_played: 2,
        correct_score_points: 1,
      };
      const matchById = new Map(matches.data?.map((m) => [m.id, m]));
      const knockoutRows = new Map<string, Row>();
      const groupRows = new Map<string, Row>();
      
      players.data?.forEach((p) => {
        knockoutRows.set(p.id, {
          player_id: p.id,
          name: p.name,
          points: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          not_played: 0,
          picks: 0,
        });
        groupRows.set(p.id, {
          player_id: p.id,
          name: p.name,
          points: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          not_played: 0,
          picks: 0,
        });
      });

      picks.data?.forEach((pk) => {
        const m = matchById.get(pk.match_id);
        if (!m) return;
        const r = m.is_knockout ? knockoutRows.get(pk.player_id) : groupRows.get(pk.player_id);
        if (!r) return;
        
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
        
        if (
          m.score_a !== null &&
          m.score_a !== undefined &&
          pk.predicted_score_a === m.score_a &&
          m.score_b !== null &&
          m.score_b !== undefined &&
          pk.predicted_score_b === m.score_b
        ) {
          r.points += (s as any).correct_score_points ?? 1;
        }
      });
      
      const knockout = Array.from(knockoutRows.values()).sort((a, b) => b.points - a.points || b.wins - a.wins);
      const group = Array.from(groupRows.values()).sort((a, b) => b.points - a.points || b.wins - a.wins);
      return { knockout, group };
    },
    enabled: !!me,
  });

  function handleCopy() {
    if (!me?.group_code) return;
    navigator.clipboard.writeText(me.group_code).then(() => {
      setCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleShare() {
    if (!me?.group_code) return;
    const url = window.location.origin;
    const text = `Join my FIFA Fantasy group! Use code: ${me.group_code}\n${url}`;
    if (navigator.share) {
      navigator.share({ title: "FIFA Fantasy", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => toast.success("Share text copied!"));
    }
  }

  // Not signed in
  if (!me) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-muted-foreground">You need to join a group first.</p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="rounded-md bg-neon px-5 py-3 font-semibold text-primary-foreground glow-neon"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Group code banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-neon/40 bg-neon/5 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Your Group Code</p>
          <p id="group-code-display" className="display text-3xl text-neon tracking-widest font-mono">
            {me.group_code}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Share this code so friends can join your group</p>
        </div>
        <div className="flex gap-2">
          <button
            id="btn-copy-code"
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg border border-neon/40 bg-neon/10 px-4 py-2 text-sm font-semibold text-neon hover:bg-neon/20 transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            id="btn-share-code"
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      <div>
        <h1 className="display text-4xl">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Live standings for the Knockout Stage.</p>
      </div>

      {q.data && q.data.knockout.length >= 1 && (
        <div className="grid sm:grid-cols-3 gap-3">
          {q.data.knockout.slice(0, 3).map((r, i) => (
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

      <LeaderboardTable 
        data={q.data?.knockout} 
        me={me} 
        editingId={editingId} 
        editName={editName} 
        setEditingId={setEditingId} 
        setEditName={setEditName} 
        updateNameMut={updateNameMut} 
        makeAdminMut={makeAdminMut} 
      />

      <div className="pt-12">
        <h2 className="display text-3xl">Group Stage Results</h2>
        <p className="text-sm text-muted-foreground mb-6">Final standings from the group stage.</p>
        <LeaderboardTable 
          data={q.data?.group} 
          me={me} 
          editingId={editingId} 
          editName={editName} 
          setEditingId={setEditingId} 
          setEditName={setEditName} 
          updateNameMut={updateNameMut} 
          makeAdminMut={makeAdminMut} 
        />
      </div>
    </div>
  );
}

function LeaderboardTable({
  data,
  me,
  editingId,
  editName,
  setEditingId,
  setEditName,
  updateNameMut,
  makeAdminMut,
}: {
  data?: Row[];
  me: any;
  editingId: string | null;
  editName: string;
  setEditingId: (id: string | null) => void;
  setEditName: (name: string) => void;
  updateNameMut: any;
  makeAdminMut: any;
}) {
  return (
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
          {data?.map((r, i) => (
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
                    {me?.is_admin && (
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-all">
                        <button
                          onClick={() => {
                            setEditingId(r.player_id);
                            setEditName(r.name);
                          }}
                          className="text-muted-foreground hover:text-neon"
                          title="Edit Name"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        {me.id !== r.player_id && (
                          <button
                            onClick={() => confirm(`Make ${r.name} an admin?`) && makeAdminMut.mutate(r.player_id)}
                            className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-neon border border-transparent hover:border-neon/40 px-1.5 py-0.5 rounded"
                            disabled={makeAdminMut.isPending}
                          >
                            Make Admin
                          </button>
                        )}
                      </div>
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
          {data?.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                No players yet — share your group code to invite friends!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
