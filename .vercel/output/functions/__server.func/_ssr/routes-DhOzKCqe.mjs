import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useCurrentPlayer, t as setCurrentPlayer } from "./current-player-B1eDXAE7.mjs";
import { t as supabase } from "./client-BEK1FrYQ.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DhOzKCqe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	const player = useCurrentPlayer();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const stats = useQuery({
		queryKey: ["home-stats"],
		queryFn: async () => {
			const [matches, players] = await Promise.all([supabase.from("matches").select("id,status", {
				count: "exact",
				head: false
			}), supabase.from("players").select("id", {
				count: "exact",
				head: true
			})]);
			return {
				total: matches.data?.length ?? 0,
				played: matches.data?.filter((m) => m.status === "played" || m.status === "not_played").length ?? 0,
				players: players.count ?? 0
			};
		}
	});
	async function handleJoin(e) {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) return;
		setLoading(true);
		try {
			const { data: existing } = await supabase.from("players").select("id,name").ilike("name", trimmed).maybeSingle();
			let p = existing;
			if (!p) {
				const { data, error } = await supabase.from("players").insert({ name: trimmed }).select("id,name").single();
				if (error) throw error;
				p = data;
			}
			setCurrentPlayer({
				id: p.id,
				name: p.name
			});
			toast.success(`Welcome, ${p.name}!`);
			navigate({ to: "/matches" });
		} catch (err) {
			toast.error(err.message ?? "Could not join");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-12 glow-neon",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-30 pointer-events-none",
					style: { background: "radial-gradient(600px circle at 80% 0%, var(--neon) 0%, transparent 60%)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs uppercase tracking-widest text-neon",
							children: "48 Teams · 104 Matches"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "display mt-4 text-5xl sm:text-7xl leading-none",
							children: [
								"Pick the winners.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-neon",
									children: "Top the table."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl text-muted-foreground",
							children: "A friendly fantasy league for the FIFA tournament. No squads, no transfers — just pick which team wins each match."
						}),
						player ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/matches",
								className: "rounded-md bg-neon px-5 py-3 font-semibold text-primary-foreground glow-neon",
								children: "Go to Matches"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/leaderboard",
								className: "rounded-md border border-border px-5 py-3 font-semibold hover:bg-secondary",
								children: "Leaderboard"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleJoin,
							className: "mt-8 flex flex-col sm:flex-row gap-3 max-w-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Enter your first name",
								className: "flex-1 rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
								maxLength: 40,
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: loading,
								className: "rounded-md bg-neon px-5 py-3 font-semibold text-primary-foreground glow-neon disabled:opacity-60",
								children: loading ? "Joining…" : "Join Game"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Matches",
						value: `${stats.data?.total ?? 0} / 104`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Played",
						value: String(stats.data?.played ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Players",
						value: String(stats.data?.players ?? 0)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display text-3xl",
						children: "How scoring works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 grid sm:grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoringRow, {
								tag: "WIN",
								desc: "Your picked team wins",
								value: "+3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoringRow, {
								tag: "DRAW",
								desc: "Match ends in a draw",
								value: "+1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoringRow, {
								tag: "LOSS",
								desc: "Your picked team loses",
								value: "−1"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoringRow, {
								tag: "NOT PLAYED",
								desc: "Match abandoned (max 2 per player)",
								value: "0"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: "Values are configurable in Scoring settings."
					})
				]
			})
		]
	});
}
function StatCard({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "display text-4xl mt-2 text-neon",
			children: value
		})]
	});
}
function ScoringRow({ tag, desc, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center justify-between rounded-md border border-border bg-secondary/40 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-widest text-muted-foreground",
			children: tag
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm",
			children: desc
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "display text-2xl text-neon",
			children: value
		})]
	});
}
//#endregion
export { Index as component };
