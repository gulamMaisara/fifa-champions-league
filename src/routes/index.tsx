import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPlayer, setCurrentPlayer, generateGroupCode } from "@/lib/current-player";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LiveScores } from "@/components/live-scores";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FIFA Fantasy Picks — 48 teams, 104 matches" },
      { name: "description", content: "Pick winners, score points, top the leaderboard." },
    ],
  }),
  component: Index,
});

type Tab = "create" | "join" | "signin";

function Index() {
  const player = useCurrentPlayer();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("create");
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const code = generateGroupCode();
      const { data, error } = await supabase
        .from("players")
        .insert({ name: trimmed, group_code: code, is_admin: true })
        .select("id,name,group_code,is_admin")
        .single();
      if (error) throw error;
      setCurrentPlayer({ id: data.id, name: data.name, group_code: data.group_code, is_admin: data.is_admin ?? false });
      toast.success(`Group created! Share your code: ${code}`);
      navigate({ to: "/leaderboard" });
    } catch (err: any) {
      toast.error(err.message ?? "Could not create group");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    const code = joinCode.trim().toUpperCase();
    if (!trimmed || !code) return;
    setLoading(true);
    try {
      // Check if this group code actually exists
      const { data: groupCheck, error: groupErr } = await supabase
        .from("players")
        .select("id")
        .eq("group_code", code)
        .limit(1);

      if (groupErr) throw groupErr;

      if (!groupCheck || groupCheck.length === 0) {
        toast.error("Group code not found. Check the code and try again.");
        setLoading(false);
        return;
      }

      // Check if player with same name exists in this group
      const { data: existing } = await supabase
        .from("players")
        .select("id,name,group_code,is_admin")
        .ilike("name", trimmed)
        .eq("group_code", code)
        .maybeSingle();

      if (tab === "join") {
        if (existing) {
          setJoinError("This name is already taken. Please choose another name, or go to Sign In to log back in.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("players")
          .insert({ name: trimmed, group_code: code })
          .select("id,name,group_code,is_admin")
          .single();
        if (error) throw error;

        setCurrentPlayer({ id: data.id, name: data.name, group_code: data.group_code, is_admin: data.is_admin ?? false });
        toast.success(`Welcome, ${data.name}!`);
        navigate({ to: "/matches" });
      } else if (tab === "signin") {
        if (!existing) {
          setJoinError("Name not found in this group. Did you mean to Join Group instead?");
          setLoading(false);
          return;
        }

        setCurrentPlayer({ id: existing.id, name: existing.name, group_code: existing.group_code, is_admin: existing.is_admin ?? false });
        toast.success(`Welcome back, ${existing.name}!`);
        navigate({ to: "/matches" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Could not process request");
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
            <div className="mt-8 max-w-md">
              {/* Tab switcher */}
              <div className="flex rounded-lg border border-border overflow-hidden mb-5 w-fit">
                <button
                  id="tab-create"
                  onClick={() => { setTab("create"); setJoinError(""); }}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${tab === "create"
                      ? "bg-neon text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Create
                </button>
                <button
                  id="tab-join"
                  onClick={() => { setTab("join"); setJoinError(""); }}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${tab === "join"
                      ? "bg-neon text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Join
                </button>
                <button
                  id="tab-signin"
                  onClick={() => { setTab("signin"); setJoinError(""); }}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${tab === "signin"
                      ? "bg-neon text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Sign In
                </button>
              </div>
              {tab !== "signin" && (
                <div className="mb-5 rounded-lg border border-neon/30 bg-neon/5 p-4 text-sm text-muted-foreground shadow-sm">
                  <p className="font-semibold text-neon mb-1.5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v-4" /><path d="M12 8h.01" /><rect width="20" height="16" x="2" y="4" rx="2" /></svg>
                    Pick your name carefully!
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Use a <strong>unique</strong> name (e.g., "John S." instead of just "John").</li>
                    <li>Make it <strong>easy to remember</strong> — your name is your key to log back in.</li>
                    <li>Always use the exact same name to access your picks later.</li>
                  </ul>
                </div>)}

              {tab === "create" ? (
                <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="create-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your first name"
                    className="flex-1 rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    maxLength={40}
                    required
                  />
                  <button
                    id="btn-create"
                    disabled={loading}
                    className="rounded-md bg-neon px-5 py-3 font-semibold text-primary-foreground glow-neon disabled:opacity-60 whitespace-nowrap"
                  >
                    {loading ? "Creating…" : "Create Group"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleJoin} className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="join-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your first name"
                      className="flex-1 rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      maxLength={40}
                      required
                    />
                    <input
                      id="join-code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Group code"
                      className="flex-1 rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono uppercase tracking-widest"
                      maxLength={12}
                      required
                    />
                  </div>
                  {joinError && (
                    <p className="text-sm font-semibold text-destructive mt-1">
                      {joinError}
                    </p>
                  )}
                  <button
                    id="btn-join"
                    disabled={loading}
                    className="rounded-md bg-neon px-5 py-3 font-semibold text-primary-foreground glow-neon disabled:opacity-60"
                  >
                    {loading ? "Processing…" : tab === "signin" ? "Sign In" : "Join Group"}
                  </button>
                </form>
              )}

              <p className="mt-3 text-xs text-muted-foreground">
                {tab === "create"
                  ? "A unique group code will be generated — share it with friends to play together."
                  : tab === "join"
                    ? "Ask the group creator for their code and enter it above."
                    : "Enter your exact name and group code to log back in."}
              </p>
            </div>
          )}
        </div>
      </section>

      <LiveScores />

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
