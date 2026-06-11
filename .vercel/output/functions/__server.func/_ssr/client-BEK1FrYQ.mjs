import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-BEK1FrYQ.js
function createSupabaseClient() {
	return createClient("https://oltyfwqotruvicxzenmj.supabase.co", "sb_publishable_z3VB839aT907tRCB-amsfg_O5wdjw-E", { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
