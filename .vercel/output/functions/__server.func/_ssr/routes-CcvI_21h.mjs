import { o as TRIP } from "./constants-CmxHh-5F.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { O as CalendarDays, k as Bus, o as Ticket, u as MapPin } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as SiteHeader } from "./site-header-Dg_Eev9O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CcvI_21h.js
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "container mx-auto px-6 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-3xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-primary" }), TRIP.university]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-5xl font-semibold leading-tight sm:text-7xl",
						children: ["Road trip to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gradient-sunset",
							children: "Badulla"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mx-auto mt-6 max-w-xl text-lg text-muted-foreground",
						children: [
							"Register, pay, and lock in your seat for the batch trip on",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: TRIP.date
							}),
							". Eight buses, fifty seats each — first paid, first served."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "bg-gradient-ember px-8 shadow-ember",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: "Get started"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "border-border/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dashboard",
								children: "Open dashboard"
							})
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-3",
				children: [
					{
						icon: CalendarDays,
						title: TRIP.date,
						sub: "Trip date"
					},
					{
						icon: Bus,
						title: "8 buses · 400 seats",
						sub: "Live availability"
					},
					{
						icon: Ticket,
						title: "Rs. 3,000 total",
						sub: "Advance + Final"
					}
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card rounded-2xl p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-6 w-6 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 font-display text-xl font-semibold",
							children: f.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: f.sub
						})
					]
				}, f.title))
			})]
		})]
	});
}
//#endregion
export { Index as component };
