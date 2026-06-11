import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/current-player-B1eDXAE7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
export { useCurrentPlayer as n, setCurrentPlayer as t };
