import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlayer } from "@/lib/current-player";
import { toast } from "sonner";
import { useState } from "react";

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

  const pickMut = useMutation({
    mutationFn: async (picked: "team_a" | "team_b") => {
      if (!player) throw new Error("Join first");
      if (myPick) {
        const { error } = await supabase.from("picks").update({ picked }).eq("id", myPick.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("picks")
          .insert({ player_id: player.id, match_id: id, picked });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Pick saved");
      qc.invalidateQueries({ queryKey: ["match-picks", id] });
      qc.invalidateQueries({ queryKey: ["my-picks", player?.id] });
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
  const locked = m.status !== "scheduled";

  return (
    <div className="space-y-6">
      <Link to="/matches" className="text-sm text-muted-foreground hover:text-foreground">
        ← All matches
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          {m.status === "scheduled"
            ? "Upcoming"
            : m.status === "not_played"
              ? "Not played"
              : "Played"}
          {m.kickoff_at && <> · {new Date(m.kickoff_at).toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short" })}</>}
        </div>
        <h1 className="display text-5xl mt-2">
          <span className={m.result === "team_a" ? "text-neon" : ""}>{m.team_a}</span>
          <span className="text-muted-foreground text-3xl mx-3">vs</span>
          <span className={m.result === "team_b" ? "text-neon" : ""}>{m.team_b}</span>
        </h1>
        {m.result === "draw" && <p className="text-muted-foreground mt-1">Result: Draw</p>}

        {m.description && <p className="mt-4 text-sm whitespace-pre-wrap">{m.description}</p>}

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <TeamPanel name={m.team_a} stats={m.team_a_stats} side="A" />
          <TeamPanel name={m.team_b} stats={m.team_b_stats} side="B" />
        </div>
      </div>

      {/* Picking */}
      {player && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="display text-2xl">Your pick</h2>
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
              selected={myPick?.picked === "team_a"}
              disabled={locked || pickMut.isPending}
              onClick={() => pickMut.mutate("team_a")}
            />
            <PickButton
              label={m.team_b}
              selected={myPick?.picked === "team_b"}
              disabled={locked || pickMut.isPending}
              onClick={() => pickMut.mutate("team_b")}
            />
          </div>
        </div>
      )}

      {/* Result entry — anyone can */}
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
        ) : locked ? (
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

      {/* Other players' picks */}
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

      <div className="text-right">
        <button
          onClick={() => confirm("Delete this match?") && deleteMut.mutate()}
          className="text-xs text-destructive hover:underline"
        >
          Delete match
        </button>
      </div>
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
