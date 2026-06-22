import { t as supabase } from "./client-CnB-OalF.mjs";
import { o as TRIP } from "./constants-CmxHh-5F.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as CircleX, S as Circle, i as UserRound, n as Wallet, o as Ticket, w as CircleCheck, x as Clock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Route } from "./route-C3yMXaf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BbWrN_rN.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { user } = Route.useRouteContext();
	const { data: profile, isLoading } = useQuery({
		queryKey: ["profile", user.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const profileComplete = !!(profile?.name && profile?.registration_number && profile?.department && profile?.gender && profile?.phone && profile?.lunch_preference && profile?.dinner_preference);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container mx-auto px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: "Welcome"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-semibold",
						children: profile?.name || user.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"Trip to ",
							TRIP.destination,
							" · ",
							TRIP.date
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
						icon: UserRound,
						title: "1. Complete your profile",
						status: profileComplete ? "done" : "todo",
						desc: "Add your registration number, department, gender, phone and meal preferences.",
						cta: profileComplete ? "Edit profile" : "Complete profile",
						to: "/profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
						icon: Wallet,
						title: "2. Advance payment",
						status: mapPayment(profile?.advance_payment_status),
						desc: `Pay Rs.${TRIP.advanceAmount.toLocaleString()} and upload your slip to unlock seat booking.`,
						cta: "Upload slip",
						to: "/payments",
						disabled: !profileComplete
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
						icon: Ticket,
						title: "3. Book your seat",
						status: profile?.advance_payment_status === "approved" ? "todo" : "locked",
						desc: "Choose your bus and seat after your advance payment is approved.",
						cta: "Choose seat",
						to: "/booking",
						disabled: profile?.advance_payment_status !== "approved"
					})
				]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: "Loading your data…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					className: "bg-gradient-ember shadow-ember",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ticket",
						children: "View your ticket →"
					})
				})
			})
		]
	});
}
function mapPayment(s) {
	if (s === "approved") return "done";
	if (s === "pending") return "pending";
	if (s === "rejected") return "rejected";
	return "todo";
}
function StepCard({ icon: Icon, title, status, desc, cta, to, disabled }) {
	const badge = {
		done: {
			label: "Done",
			cls: "bg-primary/15 text-primary",
			I: CircleCheck
		},
		pending: {
			label: "Pending",
			cls: "bg-cream/10 text-cream",
			I: Clock
		},
		rejected: {
			label: "Rejected",
			cls: "bg-destructive/15 text-destructive",
			I: CircleX
		},
		todo: {
			label: "To do",
			cls: "bg-muted text-muted-foreground",
			I: Circle
		},
		locked: {
			label: "Locked",
			cls: "bg-muted text-muted-foreground",
			I: Circle
		}
	}[status];
	const BadgeIcon = badge.I;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card rounded-2xl p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 place-items-center rounded-xl bg-gradient-ember shadow-ember",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badge.cls}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeIcon, { className: "h-3.5 w-3.5" }), badge.label]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-5 font-display text-lg font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: desc
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				disabled,
				variant: "outline",
				size: "sm",
				className: "mt-5 w-full border-border/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to,
					children: cta
				})
			})
		]
	});
}
//#endregion
export { Dashboard as component };
