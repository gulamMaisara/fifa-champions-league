import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlayer } from "@/lib/current-player";
import { toast } from "sonner";
import { fromZonedTime } from "date-fns-tz";
import { formatTimeRemaining } from "@/lib/utils";

export const Route = createFileRoute("/matches")({
  head: () => ({ meta: [{ title: "Matches — FIFA Fantasy" }] }),
  component: MatchesPage,
});

type MatchRow = {
  id: string;
  team_a: string;
  team_b: string;
  description: string | null;
  status: "scheduled" | "played" | "not_played";
  result: "team_a" | "team_b" | "draw" | null;
  kickoff_at: string | null;
};

function MatchesPage() {
  const player = useCurrentPlayer();
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<"all" | "scheduled" | "played">("all");

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id,team_a,team_b,description,status,result,kickoff_at,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MatchRow[];
    },
  });

  const { data: myPicks = {} } = useQuery({
    queryKey: ["my-picks", player?.id],
    enabled: !!player,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("picks")
        .select("match_id,picked")
        .eq("player_id", player!.id);
      if (error) throw error;
      const map: Record<string, "team_a" | "team_b"> = {};
      data?.forEach((p) => {
        map[p.match_id] = p.picked as any;
      });
      return map;
    },
  });

  const visible = matches.filter((m) => {
    if (filter === "scheduled") return m.status === "scheduled";
    if (filter === "played") return m.status !== "scheduled";
    return true;
  });

  if (!player) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p>Join the game first.</p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-md bg-neon px-4 py-2 font-semibold text-primary-foreground"
        >
          Enter your name
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display text-4xl">Matches</h1>
          <p className="text-sm text-muted-foreground">{matches.length} of 104 added</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border bg-card p-1 text-sm">
            {(["all", "scheduled", "played"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded ${filter === f ? "bg-neon text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="rounded-md bg-neon px-4 py-2 font-semibold text-primary-foreground glow-neon"
          >
            {showAdd ? "Cancel" : "+ Add Match"}
          </button>
        </div>
      </div>

      {showAdd && (
        <AddMatchForm
          onDone={() => {
            setShowAdd(false);
            qc.invalidateQueries({ queryKey: ["matches"] });
          }}
        />
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No matches yet. Add the first fixture.
        </div>
      ) : (
        <div className="grid gap-3">
          {visible.map((m) => (
            <MatchCard key={m.id} match={m} myPick={myPicks[m.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, myPick }: { match: MatchRow; myPick?: "team_a" | "team_b" }) {
  const statusColor =
    match.status === "scheduled"
      ? "text-amber-400"
      : match.status === "not_played"
        ? "text-muted-foreground"
        : "text-neon";
  const statusLabel =
    match.status === "scheduled"
      ? "Upcoming"
      : match.status === "not_played"
        ? "Not played"
        : "Played";
  return (
    <Link
      to="/matches/$id"
      params={{ id: match.id }}
      className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 hover:border-neon/60 hover:bg-card/80 transition"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
          <span className={statusColor}>{statusLabel}</span>
          {match.kickoff_at && (
            <span className="text-muted-foreground">
              · {new Date(match.kickoff_at).toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short" })}
              {match.status === "scheduled" && (() => {
                const tr = formatTimeRemaining(match.kickoff_at);
                return tr ? ` (${tr})` : "";
              })()}
            </span>
          )}
        </div>
        <div className="display text-2xl mt-1 truncate">
          <TeamName name={match.team_a} winner={match.result === "team_a"} />{" "}
          <span className="text-muted-foreground text-lg">vs</span>{" "}
          <TeamName name={match.team_b} winner={match.result === "team_b"} />
          {match.result === "draw" && (
            <span className="text-muted-foreground text-base ml-2">(Draw)</span>
          )}
        </div>
        {match.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{match.description}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        {myPick ? (
          <div className="rounded-md border border-neon/40 bg-neon/10 px-3 py-1.5 text-xs text-neon uppercase tracking-widest">
            Picked: {myPick === "team_a" ? match.team_a : match.team_b}
          </div>
        ) : match.status === "scheduled" ? (
          <div className="rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-400 uppercase tracking-widest">
            No pick
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">—</div>
        )}
      </div>
    </Link>
  );
}

function TeamName({ name, winner }: { name: string; winner: boolean }) {
  return <span className={winner ? "text-neon" : ""}>{name}</span>;
}

function AddMatchForm({ onDone }: { onDone: () => void }) {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [aStats, setAStats] = useState("");
  const [bStats, setBStats] = useState("");
  const [desc, setDesc] = useState("");
  const [kickoff, setKickoff] = useState("");

  const mut = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("matches").insert({
        team_a: teamA.trim(),
        team_b: teamB.trim(),
        team_a_stats: aStats.trim() || null,
        team_b_stats: bStats.trim() || null,
        description: desc.trim() || null,
        kickoff_at: kickoff ? fromZonedTime(kickoff, "America/New_York").toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Match added");
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!teamA.trim() || !teamB.trim()) return;
        mut.mutate();
      }}
      className="rounded-xl border border-border bg-card p-5 space-y-3"
    >
      <h2 className="display text-2xl">New Fixture</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Team A" value={teamA} onChange={setTeamA} required />
        <Input label="Team B" value={teamB} onChange={setTeamB} required />
        <Textarea label="Team A stats / form" value={aStats} onChange={setAStats} />
        <Textarea label="Team B stats / form" value={bStats} onChange={setBStats} />
      </div>
      <Textarea label="Match description / notes" value={desc} onChange={setDesc} />
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Kickoff (optional)
        </label>
        <input
          type="datetime-local"
          value={kickoff}
          onChange={(e) => setKickoff(e.target.value)}
          className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onDone}
          className="rounded-md border border-border px-4 py-2 text-sm"
        >
          Cancel
        </button>
        <button
          disabled={mut.isPending}
          className="rounded-md bg-neon px-4 py-2 text-sm font-semibold text-primary-foreground glow-neon disabled:opacity-60"
        >
          {mut.isPending ? "Saving…" : "Add Match"}
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
      />
    </div>
  );
}
