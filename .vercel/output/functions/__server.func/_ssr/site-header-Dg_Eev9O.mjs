import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CnB-OalF.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as LogOut, k as Bus, s as Shield } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-header-Dg_Eev9O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useAuth() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
			setUser(s?.user ?? null);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setUser(data.session?.user ?? null);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return {
		session,
		user,
		loading
	};
}
function useIsAdmin(userId) {
	return useQuery({
		queryKey: ["is-admin", userId],
		enabled: !!userId,
		queryFn: async () => {
			if (!userId) return false;
			const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
			if (error) throw error;
			return !!data;
		}
	});
}
function SiteHeader() {
	const { user } = useAuth();
	const { data: isAdmin } = useIsAdmin(user?.id);
	const navigate = useNavigate();
	const signOut = async () => {
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl bg-background/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container mx-auto flex items-center justify-between px-6 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-ember shadow-ember",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bus, { className: "h-5 w-5 text-primary-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg font-semibold",
						children: "Badulla Trip"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
						children: "Batch Trip 2026"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex items-center gap-1 sm:gap-2",
				children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							children: "Dashboard"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/payments",
							children: "Payments"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/booking",
							children: "Seat"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ticket",
							children: "Ticket"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile",
							children: "Profile"
						})
					}),
					isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						className: "text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mr-1.5 h-4 w-4" }), "Admin"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: signOut,
						variant: "outline",
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-1.5 h-4 w-4" }), " Sign out"]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					className: "bg-gradient-ember shadow-ember",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						children: "Sign in"
					})
				})
			})]
		})
	});
}
//#endregion
export { SiteHeader as t };
