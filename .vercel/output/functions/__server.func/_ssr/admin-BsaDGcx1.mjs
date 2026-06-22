import { t as supabase } from "./client-CnB-OalF.mjs";
import { o as TRIP } from "./constants-CmxHh-5F.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as CircleX, k as Bus, n as Wallet, o as Ticket, r as Users, w as CircleCheck, x as Clock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BsaDGcx1.js
var import_jsx_runtime = require_jsx_runtime();
function AdminOverview() {
	const { data: stats, isLoading } = useQuery({
		queryKey: ["admin-stats"],
		queryFn: async () => {
			const [profiles, slips, bookings, buses] = await Promise.all([
				supabase.from("profiles").select("id, advance_payment_status, final_payment_status"),
				supabase.from("payment_slips").select("id, status, amount"),
				supabase.from("seat_bookings").select("id, bus_id"),
				supabase.from("buses").select("id, capacity")
			]);
			const p = profiles.data ?? [];
			const s = slips.data ?? [];
			const b = bookings.data ?? [];
			const totalCapacity = (buses.data ?? []).reduce((a, x) => a + x.capacity, 0);
			const advanceApproved = p.filter((x) => x.advance_payment_status === "approved").length;
			const finalApproved = p.filter((x) => x.final_payment_status === "approved").length;
			const totalCollected = s.filter((x) => x.status === "approved").reduce((a, x) => a + Number(x.amount), 0);
			return {
				students: p.length,
				slipsPending: s.filter((x) => x.status === "pending").length,
				slipsApproved: s.filter((x) => x.status === "approved").length,
				slipsRejected: s.filter((x) => x.status === "rejected").length,
				advanceApproved,
				finalApproved,
				seatsBooked: b.length,
				totalCapacity,
				totalCollected
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container mx-auto px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
					children: "Admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-4xl font-semibold",
					children: "Trip Overview"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						TRIP.destination,
						" · ",
						TRIP.date
					]
				})
			]
		}), isLoading || !stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "Loading stats…"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Users,
						label: "Registered students",
						value: stats.students
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: CircleCheck,
						label: "Advance approved",
						value: stats.advanceApproved
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Ticket,
						label: "Seats booked",
						value: `${stats.seatsBooked}/${stats.totalCapacity}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Wallet,
						label: "Total collected (Rs.)",
						value: stats.totalCollected.toLocaleString()
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlipBox, {
						label: "Pending slips",
						value: stats.slipsPending,
						icon: Clock,
						cls: "text-cream"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlipBox, {
						label: "Approved slips",
						value: stats.slipsApproved,
						icon: CircleCheck,
						cls: "text-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlipBox, {
						label: "Rejected slips",
						value: stats.slipsRejected,
						icon: CircleX,
						cls: "text-destructive"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLink, {
						to: "/admin/payments",
						icon: Wallet,
						title: "Payment slips",
						desc: "Review uploaded slips"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLink, {
						to: "/admin/students",
						icon: Users,
						title: "Students",
						desc: "All registered students"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLink, {
						to: "/admin/buses",
						icon: Bus,
						title: "Buses",
						desc: "Seat occupancy by bus"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 text-xs text-muted-foreground",
				children: [
					"Total capacity: ",
					stats.totalCapacity,
					" seats · ",
					50,
					" per bus."
				]
			})
		] })]
	});
}
function Stat({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card rounded-2xl p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 font-display text-3xl font-semibold",
			children: value
		})]
	});
}
function SlipBox({ label, value, icon: Icon, cls }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card flex items-center justify-between rounded-2xl p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-display text-2xl font-semibold",
			children: value
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-7 w-7 ${cls}` })]
	});
}
function AdminLink({ to, icon: Icon, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: "glass-card group rounded-2xl p-5 transition hover:border-primary/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-ember shadow-ember",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary-foreground" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-lg font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: desc
			})] })]
		})
	});
}
//#endregion
export { AdminOverview as component };
