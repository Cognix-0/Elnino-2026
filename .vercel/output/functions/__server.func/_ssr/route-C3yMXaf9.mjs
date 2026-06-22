import { t as supabase } from "./client-CnB-OalF.mjs";
import { f as lazyRouteComponent, k as redirect, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-C3yMXaf9.js
var $$splitComponentImporter = () => import("./route-CthfGIP6.mjs");
var Route = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
