import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as useCurrentPlayer } from "./current-player-B1eDXAE7.mjs";
import { t as supabase } from "./client-BEK1FrYQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-DYlivzjR.js
var import_jsx_runtime = require_jsx_runtime();
function Leaderboard() {
	const me = useCurrentPlayer();
	const q = useQuery({
		queryKey: ["leaderboard"],
		queryFn: async () => {
			const [players, picks, matches, settingsRes] = await Promise.all([
				supabase.from("players").select("id,name"),
				supabase.from("picks").select("player_id,match_id,picked"),
				supabase.from("matches").select("id,status,result"),
				supabase.from("scoring_settings").select("*").eq("id", 1).single()
			]);
			if (players.error) throw players.error;
			const s = settingsRes.data ?? {
				win_points: 3,
				draw_points: 1,
				loss_points: -1,
				not_played_points: 0,
				max_not_played: 2
			};
			const matchById = new Map(matches.data?.map((m) => [m.id, m]));
			const rows = /* @__PURE__ */ new Map();
			players.data?.forEach((p) => rows.set(p.id, {
				player_id: p.id,
				name: p.name,
				points: 0,
				wins: 0,
				draws: 0,
				losses: 0,
				not_played: 0,
				picks: 0
			}));
			picks.data?.forEach((pk) => {
				const r = rows.get(pk.player_id);
				const m = matchById.get(pk.match_id);
				if (!r || !m) return;
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
			});
			return Array.from(rows.values()).sort((a, b) => b.points - a.points || b.wins - a.wins);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display text-4xl",
				children: "Leaderboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Live standings across all played matches."
			})] }),
			q.data && q.data.length >= 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid sm:grid-cols-3 gap-3",
				children: q.data.slice(0, 3).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-2xl border p-5 ${i === 0 ? "border-neon bg-neon/10 glow-neon" : "border-border bg-card"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "display text-5xl text-neon",
							children: ["#", i + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "display text-2xl mt-1 truncate",
							children: r.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs uppercase tracking-widest text-muted-foreground mt-1",
							children: [
								r.points,
								" pts · ",
								r.wins,
								"W ",
								r.draws,
								"D ",
								r.losses,
								"L"
							]
						})
					]
				}, r.player_id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "#"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Player"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Pts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "W"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "D"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "L"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "NP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Picks"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [q.data?.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: `border-t border-border ${me?.id === r.player_id ? "bg-neon/5" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 font-medium",
								children: [r.name, me?.id === r.player_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs text-neon",
									children: "you"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right display text-xl text-neon",
								children: r.points
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right",
								children: r.wins
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right",
								children: r.draws
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right",
								children: r.losses
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right",
								children: r.not_played
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right text-muted-foreground",
								children: r.picks
							})
						]
					}, r.player_id)), q.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 8,
						className: "px-4 py-8 text-center text-muted-foreground",
						children: "No players yet."
					}) })] })]
				})
			})
		]
	});
}
//#endregion
export { Leaderboard as component };
