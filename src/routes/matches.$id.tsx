import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlayer } from "@/lib/current-player";
import { toast } from "sonner";
import { useState } from "react";
import { formatTimeRemaining, getMatchStatusLabel } from "@/lib/utils";
import { useLiveScores } from "@/components/live-scores";

export const Route = createFileRoute("/matches/$id")({
  head: () => ({ meta: [{ title: "Match — FIFA Fantasy" }] }),
  component: MatchDetail,
});

function MatchDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const player = useCurrentPlayer();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const { data: liveScores } = useLiveScores();

  const matchQ = useQuery({
    queryKey: ["match", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("matches").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const picksQ = useQuery({
    queryKey: ["match-picks", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("picks")
        .select("id,player_id,picked,players(name)")
        .eq("match_id", id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const myPick = picksQ.data?.find((p) => p.player_id === player?.id);

  const playersQ = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { data, error } = await supabase.from("players").select("id,name").order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!player?.is_admin,
  });

  const effectivePlayerId = player?.is_admin && selectedPlayerId ? selectedPlayerId : player?.id;
  const effectivePick = picksQ.data?.find((p) => p.player_id === effectivePlayerId);

  const pickMut = useMutation({
    mutationFn: async (picked: "team_a" | "team_b") => {
      if (!player) throw new Error("Join first");
      if (!effectivePlayerId) throw new Error("No player selected");
      if (effectivePick) {
        const { error } = await supabase.from("picks").update({ picked }).eq("id", effectivePick.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("picks")
          .insert({ player_id: effectivePlayerId, match_id: id, picked });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Pick saved");
      qc.invalidateQueries({ queryKey: ["match-picks", id] });
      qc.invalidateQueries({ queryKey: ["my-picks", effectivePlayerId] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const resultMut = useMutation({
    mutationFn: async (opts: {
      status: "scheduled" | "played" | "not_played";
      result: "team_a" | "team_b" | "draw" | null;
    }) => {
      const { error } = await supabase
        .from("matches")
        .update({ status: opts.status, result: opts.result })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Result saved");
      qc.invalidateQueries({ queryKey: ["match", id] });
      qc.invalidateQueries({ queryKey: ["matches"] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("matches").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Match deleted");
      navigate({ to: "/matches" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (matchQ.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (matchQ.error || !matchQ.data) return <p>Not found.</p>;

  const m = matchQ.data;
  const isPastKickoff = m.kickoff_at ? new Date(m.kickoff_at) < new Date() : false;
  const locked = (m.status !== "scheduled" || isPastKickoff) && !player?.is_admin;

  const liveData = liveScores?.find((lm) => {
    const a = lm.homeTeam?.name?.toLowerCase() || "";
    const b = lm.awayTeam?.name?.toLowerCase() || "";
    const sa = lm.homeTeam?.shortName?.toLowerCase() || "";
    const sb = lm.awayTeam?.shortName?.toLowerCase() || "";
    const ta = m.team_a.toLowerCase().trim();
    const tb = m.team_b.toLowerCase().trim();

    const aMatchesHome = a.includes(ta) || ta.includes(a) || sa === ta;
    const bMatchesAway = b.includes(tb) || tb.includes(b) || sb === tb;
    const aMatchesAway = b.includes(ta) || ta.includes(b) || sb === ta;
    const bMatchesHome = a.includes(tb) || tb.includes(a) || sa === tb;

    return (aMatchesHome && bMatchesAway) || (aMatchesAway && bMatchesHome);
  });

  let scoreA, scoreB, isLive = false, isFinished = false;
  if (liveData) {
    const a = liveData.homeTeam?.name?.toLowerCase() || "";
    const sa = liveData.homeTeam?.shortName?.toLowerCase() || "";
    const ta = m.team_a.toLowerCase().trim();
    const isTeamAHome = a.includes(ta) || ta.includes(a) || sa === ta;

    scoreA = isTeamAHome ? liveData.score?.fullTime?.home : liveData.score?.fullTime?.away;
    scoreB = isTeamAHome ? liveData.score?.fullTime?.away : liveData.score?.fullTime?.home;
    isLive = liveData.status === "IN_PLAY" || liveData.status === "PAUSED";
    isFinished = liveData.status === "FINISHED";
  }

  return (
    <div className="space-y-6">
      <Link to="/matches" className="text-sm text-muted-foreground hover:text-foreground">
        ← All matches
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          {!isLive && !isFinished && <span>{getMatchStatusLabel(m.status, m.kickoff_at)}</span>}
          {isLive && (
            <span className="px-2 py-0.5 rounded-full bg-neon/20 text-neon animate-pulse">
              LIVE
            </span>
          )}
          {isFinished && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              FINISHED
            </span>
          )}
          {m.kickoff_at && (
            <>
              <span>·</span>
              <span>{new Date(m.kickoff_at).toLocaleString("en-US", { timeZoneName: "short" })}</span>
              {m.status === "scheduled" && (() => {
                const tr = formatTimeRemaining(m.kickoff_at);
                return tr ? <span>({tr})</span> : null;
              })()}
            </>
          )}
        </div>

        <div className="display text-5xl mt-4 flex items-center relative py-4">
          <div className="flex-1 text-right pr-20">
            <span className={m.result === "team_a" || (isFinished && (scoreA ?? 0) > (scoreB ?? 0)) ? "text-neon" : ""}>{m.team_a}</span>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {liveData && (scoreA !== null || scoreB !== null) ? (
              <div className="flex items-center gap-3 bg-secondary/50 px-6 py-2 rounded-xl min-w-[120px] justify-center">
                <span className="text-neon font-bold">{scoreA ?? 0}</span>
                <span className="text-muted-foreground text-3xl">-</span>
                <span className="text-neon font-bold">{scoreB ?? 0}</span>
              </div>
            ) : (
              <span className="text-muted-foreground text-3xl w-[120px] text-center">vs</span>
            )}
          </div>

          <div className="flex-1 text-left pl-20">
            <span className={m.result === "team_b" || (isFinished && (scoreB ?? 0) > (scoreA ?? 0)) ? "text-neon" : ""}>{m.team_b}</span>
          </div>
        </div>

        {m.result === "draw" && <p className="text-center text-muted-foreground mt-4">Result: Draw</p>}

        {m.description && <p className="mt-4 text-sm whitespace-pre-wrap">{m.description}</p>}

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <TeamPanel name={m.team_a} stats={m.team_a_stats} side="A" />
          <TeamPanel name={m.team_b} stats={m.team_b_stats} side="B" />
        </div>
      </div>

      {/* Picking */}
      {player && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="display text-2xl">
              {player.is_admin && effectivePlayerId !== player.id ? "Player's pick" : "Your pick"}
            </h2>
            {player.is_admin && playersQ.data && (
              <select
                className="bg-secondary/40 border border-border rounded-md px-2 py-1 text-sm outline-none focus:border-neon"
                value={selectedPlayerId || player.id}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
              >
                {playersQ.data.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {locked ? (
            <p className="text-sm text-muted-foreground mt-2">
              Picks are locked — match has started or been settled.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              Pick the team you think will win. You can change it until the match starts.
            </p>
          )}
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <PickButton
              label={m.team_a}
              selected={effectivePick?.picked === "team_a"}
              disabled={locked || pickMut.isPending}
              onClick={() => pickMut.mutate("team_a")}
            />
            <PickButton
              label={m.team_b}
              selected={effectivePick?.picked === "team_b"}
              disabled={locked || pickMut.isPending}
              onClick={() => pickMut.mutate("team_b")}
            />
          </div>
        </div>
      )}

      {/* Result entry — only Abir can */}
      {player?.is_admin && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="display text-2xl">Match result</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-sm text-neon hover:underline">
                {locked ? "Edit result" : "Set result"}
              </button>
            )}
          </div>
          {editing ? (
            <ResultEditor
              current={{ status: m.status, result: m.result }}
              teamA={m.team_a}
              teamB={m.team_b}
              onCancel={() => setEditing(false)}
              onSave={(s) => {
                resultMut.mutate(s);
                setEditing(false);
              }}
            />
          ) : m.status !== "scheduled" ? (
            <p className="text-sm text-muted-foreground mt-2">
              {m.status === "not_played"
                ? "Marked as not played."
                : m.result === "draw"
                  ? "Draw."
                  : `Winner: ${m.result === "team_a" ? m.team_a : m.team_b}`}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">No result yet.</p>
          )}
        </div>
      )}

      {/* Other players' picks */}
      {/* {(player?.is_admin || m.status === "played" || isFinished) && (
        
      )} */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="display text-2xl">All picks ({picksQ.data?.length ?? 0})</h2>
        {picksQ.data && picksQ.data.length > 0 ? (
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
            {picksQ.data.map((p: any) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2"
              >
                <span className="font-medium">{p.players?.name ?? "—"}</span>
                <span
                  className={`text-xs uppercase tracking-widest ${p.picked === m.result ? "text-neon" : locked ? "text-muted-foreground line-through" : "text-muted-foreground"}`}
                >
                  {p.picked === "team_a" ? m.team_a : m.team_b}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No picks yet.</p>
        )}
      </div>

      {player?.is_admin && (
        <div className="text-right">
          <button
            onClick={() => confirm("Delete this match?") && deleteMut.mutate()}
            className="text-xs text-destructive hover:underline"
          >
            Delete match
          </button>
        </div>
      )}
    </div>
  );
}

function TeamPanel({ name, stats, side }: { name: string; stats: string | null; side: "A" | "B" }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">Team {side}</div>
      <div className="display text-2xl mt-1">{name}</div>
      {stats && <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{stats}</p>}
    </div>
  );
}

function PickButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border p-4 text-left transition disabled:opacity-50 disabled:cursor-not-allowed
        ${selected ? "border-neon bg-neon/10 glow-neon" : "border-border bg-secondary/40 hover:border-neon/50"}`}
    >
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        {selected ? "Your pick" : "Pick"}
      </div>
      <div className="display text-2xl mt-1">{label}</div>
    </button>
  );
}

function ResultEditor({
  current,
  teamA,
  teamB,
  onCancel,
  onSave,
}: {
  current: { status: string; result: string | null };
  teamA: string;
  teamB: string;
  onCancel: () => void;
  onSave: (s: {
    status: "scheduled" | "played" | "not_played";
    result: "team_a" | "team_b" | "draw" | null;
  }) => void;
}) {
  const [choice, setChoice] = useState<"team_a" | "team_b" | "draw" | "not_played" | "scheduled">(
    current.status === "not_played" ? "not_played" : ((current.result as any) ?? "scheduled"),
  );
  function save() {
    if (choice === "scheduled") onSave({ status: "scheduled", result: null });
    else if (choice === "not_played") onSave({ status: "not_played", result: null });
    else onSave({ status: "played", result: choice });
  }
  const options: { v: typeof choice; label: string }[] = [
    { v: "team_a", label: `${teamA} won` },
    { v: "team_b", label: `${teamB} won` },
    { v: "draw", label: "Draw" },
    { v: "not_played", label: "Not played" },
    { v: "scheduled", label: "Reset to upcoming" },
  ];
  return (
    <div className="mt-3 space-y-3">
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            onClick={() => setChoice(o.v)}
            className={`rounded-md border p-3 text-left text-sm ${choice === o.v ? "border-neon bg-neon/10" : "border-border bg-secondary/40"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm">
          Cancel
        </button>
        <button
          onClick={save}
          className="rounded-md bg-neon px-4 py-2 text-sm font-semibold text-primary-foreground glow-neon"
        >
          Save
        </button>
      </div>
    </div>
  );
}
