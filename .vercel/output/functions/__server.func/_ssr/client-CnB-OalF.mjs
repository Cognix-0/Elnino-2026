import { n as createClient } from "../_libs/@supabase/server+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-CnB-OalF.js
function createSupabaseClient() {
	return createClient("https://cqbnponwkgmjrcufeblo.supabase.co", "sb_publishable_XLzqeQToAwK_eLD588usnA_Ytca5c89", { auth: {
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
