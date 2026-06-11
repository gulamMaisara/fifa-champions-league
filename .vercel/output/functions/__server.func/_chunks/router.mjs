import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, r as QueryClientProvider, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { _ as useNavigate, c as HeadContent, d as Outlet, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast, t as Toaster$1 } from "../_libs/sonner.mjs";
import { t as supabase } from "./client.mjs";
//#region src/styles.css?transform-only
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-BxgLnOGE.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/lib/current-player.ts
var KEY = "fifa_fantasy_current_player";
function getCurrentPlayer() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function setCurrentPlayer(p) {
	if (typeof window === "undefined") return;
	if (p) localStorage.setItem(KEY, JSON.stringify(p));
	else localStorage.removeItem(KEY);
	window.dispatchEvent(new Event("current-player-changed"));
}
function useCurrentPlayer() {
	const [p, setP] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setP(getCurrentPlayer());
		const handler = () => setP(getCurrentPlayer());
		window.addEventListener("current-player-changed", handler);
		return () => window.removeEventListener("current-player-changed", handler);
	}, []);
	return p;
}
//#endregion
//#region src/components/ui/sonner.tsx
var import_jsx_runtime = require_jsx_runtime();
var Toaster = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-neon",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted-foreground",
					children: "Off the pitch. Page not found."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-block rounded-md bg-neon px-4 py-2 text-primary-foreground font-semibold",
					children: "Back to lobby"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Something broke"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error.message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						router.invalidate();
						reset();
					},
					className: "mt-4 rounded-md bg-neon px-4 py-2 text-primary-foreground font-semibold",
					children: "Try again"
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "FIFA Fantasy Picks" },
			{
				name: "description",
				content: "Pick winners across 104 FIFA matches and climb the leaderboard."
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function Nav() {
	const player = useCurrentPlayer();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/70",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-7 w-7 rounded-md bg-neon glow-neon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "display text-2xl tracking-wider",
						children: "FIFA FANTASY"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/matches",
							className: "px-3 py-1.5 rounded-md hover:bg-secondary",
							activeProps: { className: "px-3 py-1.5 rounded-md bg-secondary text-neon" },
							children: "Matches"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/leaderboard",
							className: "px-3 py-1.5 rounded-md hover:bg-secondary",
							activeProps: { className: "px-3 py-1.5 rounded-md bg-secondary text-neon" },
							children: "Leaderboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/settings",
							className: "px-3 py-1.5 rounded-md hover:bg-secondary",
							activeProps: { className: "px-3 py-1.5 rounded-md bg-secondary text-neon" },
							children: "Scoring"
						})
					]
				}),
				player ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline text-muted-foreground",
							children: "Playing as"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-neon",
							children: player.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCurrentPlayer(null),
							className: "ml-2 text-xs text-muted-foreground hover:text-foreground",
							children: "switch"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted-foreground",
					children: "Not signed in"
				})
			]
		})
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-6xl px-4 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				richColors: true,
				theme: "dark"
			})
		]
	});
}
//#endregion
//#region src/routes/settings.tsx
var Route$4 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Scoring — FIFA Fantasy" }] }),
	component: SettingsPage
});
function SettingsPage() {
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["scoring"],
		queryFn: async () => {
			const { data, error } = await supabase.from("scoring_settings").select("*").eq("id", 1).single();
			if (error) throw error;
			return data;
		}
	});
	const [form, setForm] = (0, import_react.useState)({
		win_points: 3,
		draw_points: 1,
		loss_points: -1,
		not_played_points: 0,
		max_not_played: 2
	});
	(0, import_react.useEffect)(() => {
		if (q.data) setForm({
			win_points: q.data.win_points,
			draw_points: q.data.draw_points,
			loss_points: q.data.loss_points,
			not_played_points: q.data.not_played_points,
			max_not_played: q.data.max_not_played
		});
	}, [q.data]);
	const save = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("scoring_settings").update(form).eq("id", 1);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Scoring updated");
			qc.invalidateQueries({ queryKey: ["scoring"] });
			qc.invalidateQueries({ queryKey: ["leaderboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "display text-4xl",
			children: "Scoring"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Tweak how points are awarded. Affects the leaderboard immediately."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberInput, {
					label: "Win points",
					value: form.win_points,
					onChange: (v) => setForm({
						...form,
						win_points: v
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberInput, {
					label: "Draw points",
					value: form.draw_points,
					onChange: (v) => setForm({
						...form,
						draw_points: v
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberInput, {
					label: "Loss points",
					value: form.loss_points,
					onChange: (v) => setForm({
						...form,
						loss_points: v
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberInput, {
					label: "Not-played points",
					value: form.not_played_points,
					onChange: (v) => setForm({
						...form,
						not_played_points: v
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberInput, {
					label: "Max not-played per player",
					value: form.max_not_played,
					onChange: (v) => setForm({
						...form,
						max_not_played: v
					}),
					min: 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => save.mutate(),
						disabled: save.isPending,
						className: "rounded-md bg-neon px-5 py-2 font-semibold text-primary-foreground glow-neon disabled:opacity-60",
						children: save.isPending ? "Saving…" : "Save"
					})
				})
			]
		})]
	});
}
function NumberInput({ label, value, onChange, min }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			value,
			min,
			onChange: (e) => onChange(parseInt(e.target.value || "0", 10)),
			className: "w-28 rounded-md border border-border bg-input px-3 py-2 text-right"
		})]
	});
}
//#endregion
//#region src/routes/matches.tsx
var Route$3 = createFileRoute("/matches")({
	head: () => ({ meta: [{ title: "Matches — FIFA Fantasy" }] }),
	component: MatchesPage
});
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
//#region src/routes/leaderboard.tsx
var Route$2 = createFileRoute("/leaderboard")({
	head: () => ({ meta: [{ title: "Leaderboard — FIFA Fantasy" }] }),
	component: Leaderboard
});
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
//#region src/routes/index.tsx
var Route$1 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "FIFA Fantasy Picks — 48 teams, 104 matches" }, {
		name: "description",
		content: "Pick winners, score points, top the leaderboard."
	}] }),
	component: Index
});
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
//#region src/routes/matches.$id.tsx
var Route = createFileRoute("/matches/$id")({
	head: () => ({ meta: [{ title: "Match — FIFA Fantasy" }] }),
	component: MatchDetail
});
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
//#region src/routeTree.gen.ts
var SettingsRoute = Route$4.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$5
});
var MatchesRoute = Route$3.update({
	id: "/matches",
	path: "/matches",
	getParentRoute: () => Route$5
});
var LeaderboardRoute = Route$2.update({
	id: "/leaderboard",
	path: "/leaderboard",
	getParentRoute: () => Route$5
});
var IndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$5
});
var MatchesRouteChildren = { MatchesIdRoute: Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => MatchesRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	LeaderboardRoute,
	MatchesRoute: MatchesRoute._addFileChildren(MatchesRouteChildren),
	SettingsRoute
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
