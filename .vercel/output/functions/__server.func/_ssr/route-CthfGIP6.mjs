import { d as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as SiteHeader } from "./site-header-Dg_Eev9O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CthfGIP6.js
var import_jsx_runtime = require_jsx_runtime();
function AuthenticatedLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
	});
}
//#endregion
export { AuthenticatedLayout as component };
