import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as useCurrentPlayer } from "./current-player-B1eDXAE7.mjs";
import { t as supabase } from "./client-BEK1FrYQ.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./matches._id-577k_5oM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/matches._id-Bhex0_6d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MatchDetail() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const player = useCurrentPlayer();
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(false);
	const matchQ = useQuery({
		queryKey: ["match", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("matches").select("*").eq("id", id).single();
			if (error) throw error;
			return data;
		}
	});
	const picksQ = useQuery({
		queryKey: ["match-picks", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("picks").select("id,player_id,picked,players(name)").eq("match_id", id);
			if (error) throw error;
			return data ?? [];
		}
	});
	const myPick = picksQ.data?.find((p) => p.player_id === player?.id);
	const pickMut = useMutation({
		mutationFn: async (picked) => {
			if (!player) throw new Error("Join first");
			if (myPick) {
				const { error } = await supabase.from("picks").update({ picked }).eq("id", myPick.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("picks").insert({
					player_id: player.id,
					match_id: id,
					picked
				});
				if (error) throw error;
			}
		},
		onSuccess: () => {
			toast.success("Pick saved");
			qc.invalidateQueries({ queryKey: ["match-picks", id] });
			qc.invalidateQueries({ queryKey: ["my-picks", player?.id] });
			qc.invalidateQueries({ queryKey: ["leaderboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const resultMut = useMutation({
		mutationFn: async (opts) => {
			const { error } = await supabase.from("matches").update({
				status: opts.status,
				result: opts.result
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Result saved");
			qc.invalidateQueries({ queryKey: ["match", id] });
			qc.invalidateQueries({ queryKey: ["matches"] });
			qc.invalidateQueries({ queryKey: ["leaderboard"] });
		},
		onError: (e) => toast.error(e.message)
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
		onError: (e) => toast.error(e.message)
	});
	if (matchQ.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Loading…"
	});
	if (matchQ.error || !matchQ.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Not found." });
	const m = matchQ.data;
	const locked = m.status !== "scheduled";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/matches",
				className: "text-sm text-muted-foreground hover:text-foreground",
				children: "← All matches"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: [m.status === "scheduled" ? "Upcoming" : m.status === "not_played" ? "Not played" : "Played", m.kickoff_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", new Date(m.kickoff_at).toLocaleString()] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "display text-5xl mt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: m.result === "team_a" ? "text-neon" : "",
								children: m.team_a
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-3xl mx-3",
								children: "vs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: m.result === "team_b" ? "text-neon" : "",
								children: m.team_b
							})
						]
					}),
					m.result === "draw" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-1",
						children: "Result: Draw"
					}),
					m.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm whitespace-pre-wrap",
						children: m.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-4 mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamPanel, {
							name: m.team_a,
							stats: m.team_a_stats,
							side: "A"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamPanel, {
							name: m.team_b,
							stats: m.team_b_stats,
							side: "B"
						})]
					})
				]
			}),
			player && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display text-2xl",
						children: "Your pick"
					}),
					locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-2",
						children: "Picks are locked — match has started or been settled."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Pick the team you think will win. You can change it until the match starts."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid sm:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickButton, {
							label: m.team_a,
							selected: myPick?.picked === "team_a",
							disabled: locked || pickMut.isPending,
							onClick: () => pickMut.mutate("team_a")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickButton, {
							label: m.team_b,
							selected: myPick?.picked === "team_b",
							disabled: locked || pickMut.isPending,
							onClick: () => pickMut.mutate("team_b")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display text-2xl",
						children: "Match result"
					}), !editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setEditing(true),
						className: "text-sm text-neon hover:underline",
						children: locked ? "Edit result" : "Set result"
					})]
				}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultEditor, {
					current: {
						status: m.status,
						result: m.result
					},
					teamA: m.team_a,
					teamB: m.team_b,
					onCancel: () => setEditing(false),
					onSave: (s) => {
						resultMut.mutate(s);
						setEditing(false);
					}
				}) : locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-2",
					children: m.status === "not_played" ? "Marked as not played." : m.result === "draw" ? "Draw." : `Winner: ${m.result === "team_a" ? m.team_a : m.team_b}`
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-2",
					children: "No result yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "display text-2xl",
					children: [
						"All picks (",
						picksQ.data?.length ?? 0,
						")"
					]
				}), picksQ.data && picksQ.data.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid sm:grid-cols-2 gap-2 text-sm",
					children: picksQ.data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: p.players?.name ?? "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-xs uppercase tracking-widest ${p.picked === m.result ? "text-neon" : locked ? "text-muted-foreground line-through" : "text-muted-foreground"}`,
							children: p.picked === "team_a" ? m.team_a : m.team_b
						})]
					}, p.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "No picks yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => confirm("Delete this match?") && deleteMut.mutate(),
					className: "text-xs text-destructive hover:underline",
					children: "Delete match"
				})
			})
		]
	});
}
function TeamPanel({ name, stats, side }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-secondary/30 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs uppercase tracking-widest text-muted-foreground",
				children: ["Team ", side]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "display text-2xl mt-1",
				children: name
			}),
			stats && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-2 whitespace-pre-wrap",
				children: stats
			})
		]
	});
}
function PickButton({ label, selected, disabled, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		disabled,
		className: `rounded-xl border p-4 text-left transition disabled:opacity-50 disabled:cursor-not-allowed
        ${selected ? "border-neon bg-neon/10 glow-neon" : "border-border bg-secondary/40 hover:border-neon/50"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-widest text-muted-foreground",
			children: selected ? "Your pick" : "Pick"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "display text-2xl mt-1",
			children: label
		})]
	});
}
function ResultEditor({ current, teamA, teamB, onCancel, onSave }) {
	const [choice, setChoice] = (0, import_react.useState)(current.status === "not_played" ? "not_played" : current.result ?? "scheduled");
	function save() {
		if (choice === "scheduled") onSave({
			status: "scheduled",
			result: null
		});
		else if (choice === "not_played") onSave({
			status: "not_played",
			result: null
		});
		else onSave({
			status: "played",
			result: choice
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid sm:grid-cols-2 gap-2",
			children: [
				{
					v: "team_a",
					label: `${teamA} won`
				},
				{
					v: "team_b",
					label: `${teamB} won`
				},
				{
					v: "draw",
					label: "Draw"
				},
				{
					v: "not_played",
					label: "Not played"
				},
				{
					v: "scheduled",
					label: "Reset to upcoming"
				}
			].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setChoice(o.v),
				className: `rounded-md border p-3 text-left text-sm ${choice === o.v ? "border-neon bg-neon/10" : "border-border bg-secondary/40"}`,
				children: o.label
			}, o.v))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 justify-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onCancel,
				className: "rounded-md border border-border px-4 py-2 text-sm",
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: save,
				className: "rounded-md bg-neon px-4 py-2 text-sm font-semibold text-primary-foreground glow-neon",
				children: "Save"
			})]
		})]
	});
}
//#endregion
export { MatchDetail as component };
