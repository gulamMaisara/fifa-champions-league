import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as useCurrentPlayer, t as setCurrentPlayer } from "./current-player-B1eDXAE7.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$5 } from "./matches._id-577k_5oM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DEx48Jkh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BxgLnOGE.css";
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
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
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
var Route$4 = createRootRouteWithContext()({
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
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-6xl px-4 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				richColors: true,
				theme: "dark"
			})
		]
	});
}
var $$splitComponentImporter$3 = () => import("./settings-XTuLvhIy.mjs");
var Route$3 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Scoring — FIFA Fantasy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./matches-CaaCk9nP.mjs");
var Route$2 = createFileRoute("/matches")({
	head: () => ({ meta: [{ title: "Matches — FIFA Fantasy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./leaderboard-DYlivzjR.mjs");
var Route$1 = createFileRoute("/leaderboard")({
	head: () => ({ meta: [{ title: "Leaderboard — FIFA Fantasy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-DhOzKCqe.mjs");
var Route = createFileRoute("/")({
	head: () => ({ meta: [{ title: "FIFA Fantasy Picks — 48 teams, 104 matches" }, {
		name: "description",
		content: "Pick winners, score points, top the leaderboard."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var SettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$4
});
var MatchesRoute = Route$2.update({
	id: "/matches",
	path: "/matches",
	getParentRoute: () => Route$4
});
var LeaderboardRoute = Route$1.update({
	id: "/leaderboard",
	path: "/leaderboard",
	getParentRoute: () => Route$4
});
var IndexRoute = Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$4
});
var MatchesRouteChildren = { MatchesIdRoute: Route$5.update({
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
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
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
