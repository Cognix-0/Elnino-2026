import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { C as CircleX, S as Circle, w as CircleCheck, x as Clock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-pill-CvzthYE3.js
var import_jsx_runtime = require_jsx_runtime();
var map = {
	approved: {
		label: "Approved",
		cls: "bg-primary/15 text-primary",
		Icon: CircleCheck
	},
	pending: {
		label: "Under review",
		cls: "bg-cream/10 text-cream",
		Icon: Clock
	},
	rejected: {
		label: "Rejected",
		cls: "bg-destructive/15 text-destructive",
		Icon: CircleX
	},
	not_uploaded: {
		label: "Not uploaded",
		cls: "bg-muted text-muted-foreground",
		Icon: Circle
	}
};
function StatusPill({ status }) {
	const m = map[status];
	const Icon = m.Icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${m.cls}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
			" ",
			m.label
		]
	});
}
//#endregion
export { StatusPill as t };
