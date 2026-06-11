import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as useCurrentPlayer } from "./current-player-B1eDXAE7.mjs";
import { t as supabase } from "./client-BEK1FrYQ.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/matches-CaaCk9nP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MatchesPage() {
	const player = useCurrentPlayer();
	const qc = useQueryClient();
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const { data: matches = [], isLoading } = useQuery({
		queryKey: ["matches"],
		queryFn: async () => {
			const { data, error } = await supabase.from("matches").select("id,team_a,team_b,description,status,result,kickoff_at,created_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: myPicks = {} } = useQuery({
		queryKey: ["my-picks", player?.id],
		enabled: !!player,
		queryFn: async () => {
			const { data, error } = await supabase.from("picks").select("match_id,picked").eq("player_id", player.id);
			if (error) throw error;
			const map = {};
			data?.forEach((p) => {
				map[p.match_id] = p.picked;
			});
			return map;
		}
	});
	const visible = matches.filter((m) => {
		if (filter === "scheduled") return m.status === "scheduled";
		if (filter === "played") return m.status !== "scheduled";
		return true;
	});
	if (!player) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-8 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Join the game first." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 inline-block rounded-md bg-neon px-4 py-2 font-semibold text-primary-foreground",
			children: "Enter your name"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display text-4xl",
					children: "Matches"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [matches.length, " of 104 added"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex rounded-md border border-border bg-card p-1 text-sm",
						children: [
							"all",
							"scheduled",
							"played"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilter(f),
							className: `px-3 py-1 rounded ${filter === f ? "bg-neon text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
							children: f[0].toUpperCase() + f.slice(1)
						}, f))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowAdd(!showAdd),
						className: "rounded-md bg-neon px-4 py-2 font-semibold text-primary-foreground glow-neon",
						children: showAdd ? "Cancel" : "+ Add Match"
					})]
				})]
			}),
			showAdd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddMatchForm, { onDone: () => {
				setShowAdd(false);
				qc.invalidateQueries({ queryKey: ["matches"] });
			} }),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Loading…"
			}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground",
				children: "No matches yet. Add the first fixture."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: visible.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchCard, {
					match: m,
					myPick: myPicks[m.id]
				}, m.id))
			})
		]
	});
}
function MatchCard({ match, myPick }) {
	const statusColor = match.status === "scheduled" ? "text-amber-400" : match.status === "not_played" ? "text-muted-foreground" : "text-neon";
	const statusLabel = match.status === "scheduled" ? "Upcoming" : match.status === "not_played" ? "Not played" : "Played";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/matches/$id",
		params: { id: match.id },
		className: "group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 hover:border-neon/60 hover:bg-card/80 transition",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs uppercase tracking-widest",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: statusColor,
						children: statusLabel
					}), match.kickoff_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: ["· ", new Date(match.kickoff_at).toLocaleString()]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "display text-2xl mt-1 truncate",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamName, {
							name: match.team_a,
							winner: match.result === "team_a"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground text-lg",
							children: "vs"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamName, {
							name: match.team_b,
							winner: match.result === "team_b"
						}),
						match.result === "draw" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground text-base ml-2",
							children: "(Draw)"
						})
					]
				}),
				match.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1 line-clamp-1",
					children: match.description
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-right shrink-0",
			children: myPick ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-neon/40 bg-neon/10 px-3 py-1.5 text-xs text-neon uppercase tracking-widest",
				children: ["Picked: ", myPick === "team_a" ? match.team_a : match.team_b]
			}) : match.status === "scheduled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-400 uppercase tracking-widest",
				children: "No pick"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: "—"
			})
		})]
	});
}
function TeamName({ name, winner }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: winner ? "text-neon" : "",
		children: name
	});
}
function AddMatchForm({ onDone }) {
	const [teamA, setTeamA] = (0, import_react.useState)("");
	const [teamB, setTeamB] = (0, import_react.useState)("");
	const [aStats, setAStats] = (0, import_react.useState)("");
	const [bStats, setBStats] = (0, import_react.useState)("");
	const [desc, setDesc] = (0, import_react.useState)("");
	const [kickoff, setKickoff] = (0, import_react.useState)("");
	const mut = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("matches").insert({
				team_a: teamA.trim(),
				team_b: teamB.trim(),
				team_a_stats: aStats.trim() || null,
				team_b_stats: bStats.trim() || null,
				description: desc.trim() || null,
				kickoff_at: kickoff || null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Match added");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			if (!teamA.trim() || !teamB.trim()) return;
			mut.mutate();
		},
		className: "rounded-xl border border-border bg-card p-5 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "display text-2xl",
				children: "New Fixture"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid sm:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						label: "Team A",
						value: teamA,
						onChange: setTeamA,
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						label: "Team B",
						value: teamB,
						onChange: setTeamB,
						required: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						label: "Team A stats / form",
						value: aStats,
						onChange: setAStats
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						label: "Team B stats / form",
						value: bStats,
						onChange: setBStats
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				label: "Match description / notes",
				value: desc,
				onChange: setDesc
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-xs uppercase tracking-widest text-muted-foreground mb-1",
				children: "Kickoff (optional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "datetime-local",
				value: kickoff,
				onChange: (e) => setKickoff(e.target.value),
				className: "w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onDone,
					className: "rounded-md border border-border px-4 py-2 text-sm",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: mut.isPending,
					className: "rounded-md bg-neon px-4 py-2 text-sm font-semibold text-primary-foreground glow-neon disabled:opacity-60",
					children: mut.isPending ? "Saving…" : "Add Match"
				})]
			})
		]
	});
}
function Input({ label, value, onChange, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "block text-xs uppercase tracking-widest text-muted-foreground mb-1",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		value,
		onChange: (e) => onChange(e.target.value),
		required,
		className: "w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
	})] });
}
function Textarea({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "block text-xs uppercase tracking-widest text-muted-foreground mb-1",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		value,
		onChange: (e) => onChange(e.target.value),
		rows: 2,
		className: "w-full rounded-md border border-border bg-input px-3 py-2 text-sm"
	})] });
}
//#endregion
export { MatchesPage as component };
