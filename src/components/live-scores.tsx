import { useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { fromZonedTime } from "date-fns-tz";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { STADIUM_TIMEZONES } from "@/lib/utils";

export interface LiveMatch {
  id: number;
  homeTeam: {
    name: string;
    shortName: string;
    tla: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    tla: string;
  };
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  status: string; // 'IN_PLAY', 'FINISHED', 'SCHEDULED', 'PAUSED'
  date?: string;
  stadium_id?: string;
  minute?: number;
  goals?: {
    minute: number;
    scorerName: string;
    teamName: string;
    type: string;
  }[];
}

export const fetchGamesFn = createServerFn({ method: "GET" }).handler(async () => {
  const res = await fetch("https://worldcup26.ir/get/games");
  if (!res.ok) throw new Error("Failed to fetch live scores");
  return res.json();
});

export const fetchFootballDataLiveScoresFn = async () => {
  try {
    const apiKey = import.meta.env.VITE_FOOTBALL_API ?? "";

    const res = await fetch("/api/football-data", {
      headers: {
        "X-Auth-Token": apiKey,
      },
    });

    if (!res.ok) {
      console.error("Football Data API Error:", res.status);
      return { matches: [], error: `API Error: ${res.status}` };
    }

    return await res.json();
  } catch (error: any) {
    console.error("Exception in fetchFootballDataLiveScoresFn:", error);
    return { matches: [], error: error.message || "Unknown error" };
  }
};


export function useLiveScores() {
  return useQuery({
    queryKey: ["live-scores"],
    queryFn: async () => {
      const data = await fetchFootballDataLiveScoresFn();
      const games = data.matches || [];
      // console.log(games)

      const mapped: LiveMatch[] = games.map((g: any) => {
        let status = g.status;
        if (status === "TIMED") status = "SCHEDULED";

        return {
          id: Number(g.id),
          homeTeam: {
            name: g.homeTeam?.name,
            shortName: g.homeTeam?.shortName,
            tla: g.homeTeam?.tla,
          },
          awayTeam: {
            name: g.awayTeam?.name,
            shortName: g.awayTeam?.shortName,
            tla: g.awayTeam?.tla,
          },
          score: {
            fullTime: {
              home: g.score?.fullTime?.home,
              away: g.score?.fullTime?.away,
            }
          },
          status,
          date: g.utcDate,
          minute: g.minute,
          goals: g.goals?.map((goal: any) => ({
            minute: goal.minute,
            scorerName: goal.scorer?.name || "Unknown",
            teamName: goal.team?.name,
            type: goal.type
          }))
        };
      });
      return mapped;
    },
    refetchInterval: 30000,
  });
}

export function LiveScores() {
  const { data: matches = [], isLoading, error } = useLiveScores();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 flex justify-center items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Fetching live scores...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-sm text-destructive">
        Error loading scores: {(error as Error).message}
      </div>
    );
  }


  // Filter out matches that are not related to top competitions if needed, or just show them.
  const activeStatuses = ["IN_PLAY", "PAUSED", "FINISHED", "TIMED", "SCHEDULED"];
  const visibleMatches = matches.filter((m: any) => activeStatuses.includes(m.status));

  const today = new Date().toDateString();
  const todaysMatches = visibleMatches.filter((m: any) => m.date && new Date(m.date).toDateString() === today);
  
  const otherMatches = visibleMatches.filter((m: any) => !todaysMatches.includes(m));

  const renderMatch = (m: any) => {
    const isLive = m.status === "IN_PLAY" || m.status === "PAUSED";
    const isFinished = m.status === "FINISHED";

    return (
      <div
        key={m.id}
        className={`rounded-xl border p-4 ${isLive ? "border-neon bg-neon/10 glow-neon" : "border-border bg-card"
          }`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground truncate max-w-[70%]">
            {m.competition?.name || "Match"}
          </span>
          <span
            className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${isLive
                ? "bg-neon/20 text-neon animate-pulse"
                : isFinished
                  ? "bg-secondary text-muted-foreground"
                  : "bg-amber-400/20 text-amber-400"
              }`}
          >
            {isLive ? "LIVE" : isFinished ? "FT" : (() => {
              if (!m.date) return "SCHEDULED";
              if (!mounted) return "...";
              try {
                const dateObj = new Date(m.date);
                return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
              } catch (e) {
                return "SCHEDULED";
              }
            })()}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className={`font-semibold truncate max-w-[80%] ${isFinished && m.score?.fullTime?.home > m.score?.fullTime?.away ? "text-neon" : ""}`}>
              {m.homeTeam?.shortName || m.homeTeam?.name}
            </span>
            <span className="display text-xl">{m.score?.fullTime?.home ?? "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`font-semibold truncate max-w-[80%] ${isFinished && m.score?.fullTime?.away > m.score?.fullTime?.home ? "text-neon" : ""}`}>
              {m.awayTeam?.shortName || m.awayTeam?.name}
            </span>
            <span className="display text-xl">{m.score?.fullTime?.away ?? "-"}</span>
          </div>
        </div>
        {m.goals && m.goals.length > 0 && (
          <div className="mt-3 border-t border-border/50 pt-2 text-[10px] text-muted-foreground flex flex-col gap-1">
            {m.goals.map((goal: any, idx: number) => (
              <div key={idx} className="flex gap-2">
                <span className="text-neon w-5 text-right">{goal.minute}'</span>
                <span className="truncate">⚽ {goal.scorerName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Live & Today's Matches
        </h2>
        <CollapsibleTrigger asChild>
          <button className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            {isOpen ? "Hide All" : "View All"}
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </CollapsibleTrigger>
      </div>

      {todaysMatches.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {todaysMatches.map(renderMatch)}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No matches today.
        </div>
      )}

      <CollapsibleContent className="space-y-4 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mt-8">
          All Other Matches
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {otherMatches.map(renderMatch)}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
