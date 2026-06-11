import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-BEK1FrYQ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-XTuLvhIy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
export { SettingsPage as component };
