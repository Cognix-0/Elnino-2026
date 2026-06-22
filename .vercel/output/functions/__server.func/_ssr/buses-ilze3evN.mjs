import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CnB-OalF.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { k as Bus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/buses-ilze3evN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminBuses() {
	const [active, setActive] = (0, import_react.useState)(1);
	const { data, isLoading } = useQuery({
		queryKey: ["admin-buses"],
		queryFn: async () => {
			const [{ data: buses }, { data: bookings }, { data: profiles }] = await Promise.all([
				supabase.from("buses").select("id, name, capacity").order("id"),
				supabase.from("seat_bookings").select("bus_id, seat_number, student_id"),
				supabase.from("profiles").select("id, name, registration_number")
			]);
			const profById = new Map((profiles ?? []).map((p) => [p.id, p]));
			const byBus = /* @__PURE__ */ new Map();
			(bookings ?? []).forEach((b) => {
				if (!byBus.has(b.bus_id)) byBus.set(b.bus_id, /* @__PURE__ */ new Map());
				byBus.get(b.bus_id).set(b.seat_number, {
					booking: b,
					profile: profById.get(b.student_id)
				});
			});
			return {
				buses: buses ?? [],
				byBus
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container mx-auto px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
					children: "Admin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl font-semibold",
					children: "Bus occupancy"
				})]
			}),
			isLoading || !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "Loading…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap gap-2",
				children: data.buses.map((b) => {
					const count = data.byBus.get(b.id)?.size ?? 0;
					const pct = Math.round(count / b.capacity * 100);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActive(b.id),
						className: `rounded-xl border px-4 py-3 text-left transition ${active === b.id ? "border-primary bg-primary/10" : "border-border/60 hover:border-primary/40"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bus, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: b.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									count,
									"/",
									b.capacity,
									" (",
									pct,
									"%)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-gradient-ember",
									style: { width: `${pct}%` }
								})
							})
						]
					}, b.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card overflow-hidden rounded-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border/60 px-5 py-3 text-sm font-medium",
					children: [
						"Bus ",
						active,
						" — passenger list"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium w-16",
									children: "Seat"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Passenger"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Reg. No."
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: Array.from({ length: 50 }, (_, i) => i + 1).map((seat) => {
								const row = data.byBus.get(active)?.get(seat);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: row ? "" : "text-muted-foreground/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2.5 font-mono",
											children: seat
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2.5",
											children: row?.profile?.name ?? "— empty —"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2.5 font-mono text-xs",
											children: row?.profile?.registration_number ?? ""
										})
									]
								}, seat);
							})
						})]
					})
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "text-sm text-muted-foreground hover:text-foreground",
					children: "← Admin overview"
				})
			})
		]
	});
}
//#endregion
export { AdminBuses as component };
