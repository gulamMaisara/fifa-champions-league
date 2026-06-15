import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlayer } from "@/lib/current-player";
import { toast } from "sonner";
import { fromZonedTime } from "date-fns-tz";
import { formatTimeRemaining, getMatchStatusLabel, STADIUM_TIMEZONES } from "@/lib/utils";
import { fetchGamesFn, useLiveScores } from "@/components/live-scores";

export const Route = createFileRoute("/matches/")({
  head: () => ({ meta: [{ title: "Matches — FIFA Fantasy" }] }),
  component: MatchesPage,
});

function getApiMatchUUID(apiId: string | number) {
  const padded = String(apiId).padStart(12, "0");
  return `00000000-0000-0000-0000-${padded}`;
}

export async function syncApiMatchesFn() {
  // 1. Fetch matches from API via Server Function
  const data = await fetchGamesFn();
  const games = data.games || [];
  console.log(games);

  // 2. Fetch existing synced matches from Supabase
  const { data: existing, error: fetchErr } = await supabase
    .from("matches")
    .select("id, team_a, team_b, kickoff_at");

  if (fetchErr) throw new Error(fetchErr.message);

  const existingMap = new Map(existing.map((m) => [m.id, m]));

  // 3. Prepare upserts
  const placeholders = ["Winner", "Runner-up", "3rd", "Loser", "Match"];
  const isPlaceholder = (name: string) => placeholders.some((p) => name.includes(p));

  const upserts = games.map((g: any) => {
    const uuid = getApiMatchUUID(g.id);
    const apiTeamA = g.home_team_name_en || g.home_team_label;
    const apiTeamB = g.away_team_name_en || g.away_team_label;
    let status = "scheduled";
    if (g.finished === "TRUE") status = "played";
    else if (g.time_elapsed !== "notstarted" && g.time_elapsed !== "finished") status = "played";

    const existingMatch = existingMap.get(uuid);

    let finalTeamA = apiTeamA;
    let finalTeamB = apiTeamB;

    let finalKickoff = null;
    if (g.local_date) {
      const parts = g.local_date.split(" ");
      if (parts.length === 2) {
        const [mo, d, y] = parts[0].split("/");
        const time = parts[1];
        const isoStr = `${y}-${mo}-${d}T${time}:00`;
        try {
          const tz = STADIUM_TIMEZONES[g.stadium_id] || "America/New_York";
          finalKickoff = fromZonedTime(isoStr, tz).toISOString();
        } catch (e) {
          console.error("Date parse error", e);
        }
      }
    }

    if (existingMatch) {
      // If existing is a placeholder, let the API overwrite it.
      // Otherwise, keep the custom name (Abir's edit).
      if (!isPlaceholder(existingMatch.team_a)) {
        finalTeamA = existingMatch.team_a;
      }
      if (!isPlaceholder(existingMatch.team_b)) {
        finalTeamB = existingMatch.team_b;
      }
    }

    return {
      id: uuid,
      team_a: finalTeamA,
      team_b: finalTeamB,
      status: status as "scheduled" | "played" | "not_played",
      kickoff_at: finalKickoff,
    };
  });

  const { error: upsertErr } = await supabase.from("matches").upsert(upserts, { onConflict: "id" });
  if (upsertErr) throw new Error(upsertErr.message);

  return { success: true, count: upserts.length };
}

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
  const [filter, setFilter] = useState<"scheduled" | "all" | "played">("scheduled");
  const { data: liveScores } = useLiveScores();

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id,team_a,team_b,description,status,result,kickoff_at,created_at")
        .order("kickoff_at", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });
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

  const syncMut = useMutation({
    mutationFn: () => syncApiMatchesFn(),
    onSuccess: () => {
      toast.success("Matches successfully synced from API!");
      qc.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: (e: any) => toast.error(e.message),
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
            {(["scheduled", "all", "played"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded ${filter === f ? "bg-neon text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {player?.is_admin && (
            <button
              onClick={() => syncMut.mutate()}
              disabled={syncMut.isPending}
              className="rounded-md border border-neon/50 px-4 py-2 font-semibold text-neon hover:bg-neon/10 transition disabled:opacity-50"
            >
              {syncMut.isPending ? "Syncing..." : "Sync API Matches"}
            </button>
          )}
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
            <MatchCard key={m.id} match={m} myPick={myPicks[m.id]} liveScores={liveScores} />
          ))}
        </div>
      )}
    </div>
  );
}

function matchTeamNames(apiTeam: any, ourTeam: string) {
  if (!apiTeam || !ourTeam) return false;
  const a = apiTeam.name?.toLowerCase() || "";
  const b = apiTeam.shortName?.toLowerCase() || "";
  const c = apiTeam.tla?.toLowerCase() || "";
  const t = ourTeam.toLowerCase().trim();
  return a.includes(t) || t.includes(a) || b === t || c === t;
}

function MatchCard({ match, myPick, liveScores }: { match: MatchRow; myPick?: "team_a" | "team_b"; liveScores?: any[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const statusColor =
    match.status === "scheduled"
      ? "text-amber-400"
      : match.status === "not_played"
        ? "text-muted-foreground"
        : "text-neon";
  const statusLabel = getMatchStatusLabel(match.status, match.kickoff_at);

  const liveData = liveScores?.find((lm) => {
    const aMatchesHome = matchTeamNames(lm.homeTeam, match.team_a);
    const bMatchesAway = matchTeamNames(lm.awayTeam, match.team_b);
    const aMatchesAway = matchTeamNames(lm.awayTeam, match.team_a);
    const bMatchesHome = matchTeamNames(lm.homeTeam, match.team_b);
    return (aMatchesHome && bMatchesAway) || (aMatchesAway && bMatchesHome);
  });

  let scoreA, scoreB, isLive = false, isFinished = false;
  if (liveData) {
    const isTeamAHome = matchTeamNames(liveData.homeTeam, match.team_a) || !matchTeamNames(liveData.awayTeam, match.team_a);
    scoreA = isTeamAHome ? liveData.score?.fullTime?.home : liveData.score?.fullTime?.away;
    scoreB = isTeamAHome ? liveData.score?.fullTime?.away : liveData.score?.fullTime?.home;
    isLive = liveData.status === "IN_PLAY" || liveData.status === "PAUSED";
    isFinished = liveData.status === "FINISHED";
  }

  return (
    <Link
      to="/matches/$id"
      params={{ id: match.id }}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 hover:border-neon/60 hover:bg-card/80 transition relative"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
          {!isLive && !isFinished && <span className={statusColor}>{statusLabel}</span>}
          {isLive && (
            <span className="px-2 py-0.5 rounded-full bg-neon/20 text-neon animate-pulse">
              LIVE
            </span>
          )}
          {isFinished && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              FT
            </span>
          )}
          {match.kickoff_at && (
            <span className="text-muted-foreground">
              · {mounted ? new Date(match.kickoff_at).toLocaleString("en-US", { timeZoneName: "short" }) : "..."}
              {match.status === "scheduled" && (() => {
                const tr = formatTimeRemaining(match.kickoff_at);
                return tr ? ` (${tr})` : "";
              })()}
            </span>
          )}
        </div>
        <div className="display text-2xl mt-2 flex flex-col gap-1 py-1 sm:max-w-[250px]">
          <div className="flex justify-between items-center">
            <TeamName name={match.team_a} winner={match.result === "team_a" || (isFinished && scoreA > scoreB)} />
            <span className="text-neon font-bold ml-4">
              {liveData && (scoreA !== null || scoreB !== null) ? (scoreA ?? 0) : "-"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <TeamName name={match.team_b} winner={match.result === "team_b" || (isFinished && scoreB > scoreA)} />
            <span className="text-neon font-bold ml-4">
              {liveData && (scoreA !== null || scoreB !== null) ? (scoreB ?? 0) : "-"}
            </span>
          </div>

          {match.result === "draw" && (
            <span className="text-muted-foreground text-sm uppercase tracking-widest mt-1">(Draw)</span>
          )}
        </div>
        {match.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{match.description}</p>
        )}
      </div>
      <div className="sm:text-right shrink-0">
        {myPick ? (
          <div className="inline-block rounded-md border border-neon/40 bg-neon/10 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs text-neon uppercase tracking-widest">
            Picked: {myPick === "team_a" ? match.team_a : match.team_b}
          </div>
        ) : match.status === "scheduled" ? (
          <div className="inline-block rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest">
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
