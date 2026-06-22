import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CnB-OalF.mjs";
import { o as TRIP } from "./constants-CmxHh-5F.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, k as redirect, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$13 } from "./route-C3yMXaf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BL3mrAr6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DoE35TZ-.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card max-w-md rounded-3xl p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-gradient-sunset text-7xl font-bold",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "That route doesn't exist on the Badulla Trip portal."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex items-center justify-center rounded-md bg-gradient-ember px-5 py-2 text-sm font-medium text-primary-foreground shadow-ember",
					children: "Back to home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card max-w-md rounded-3xl p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error.message || "An unexpected error occurred."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-gradient-ember px-4 py-2 text-sm font-medium text-primary-foreground shadow-ember",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-border px-4 py-2 text-sm font-medium",
						children: "Home"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Badulla Trip Management System" },
			{
				name: "description",
				content: "Batch trip portal — University of Ruhuna, Faculty of Engineering. Register, pay, book your seat to Badulla."
			},
			{
				property: "og:title",
				content: "Badulla Trip Management System"
			},
			{
				property: "og:description",
				content: "Batch trip portal — University of Ruhuna, Faculty of Engineering. Register, pay, book your seat to Badulla."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Badulla Trip Management System"
			},
			{
				name: "twitter:description",
				content: "Batch trip portal — University of Ruhuna, Faculty of Engineering. Register, pay, book your seat to Badulla."
			},
			{
				property: "og:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/284ce532-4017-44cc-8e11-7e8776a773a2"
			},
			{
				name: "twitter:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/284ce532-4017-44cc-8e11-7e8776a773a2"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var $$splitComponentImporter$11 = () => import("./auth-NCnykc5o.mjs");
var Route$11 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — Badulla Trip" }, {
		name: "description",
		content: "Sign in or create an account to register for the Badulla batch trip."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./routes-CcvI_21h.mjs");
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Badulla Trip — Batch Trip Portal" }, {
		name: "description",
		content: `Official portal for the ${TRIP.university} batch trip to ${TRIP.destination} on ${TRIP.date}.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./ticket-C-S-oIs0.mjs");
var Route$9 = createFileRoute("/_authenticated/ticket")({
	head: () => ({ meta: [{ title: "Your Ticket — Badulla Trip" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./profile-CuQUUj0c.mjs");
var Route$8 = createFileRoute("/_authenticated/profile")({
	head: () => ({ meta: [{ title: "Your profile — Badulla Trip" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./payments-BG-rd3F3.mjs");
var Route$7 = createFileRoute("/_authenticated/payments")({
	head: () => ({ meta: [{ title: "Payments — Badulla Trip" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./dashboard-BbWrN_rN.mjs");
var Route$6 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — Badulla Trip" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./booking-CljqvZcz.mjs");
var Route$5 = createFileRoute("/_authenticated/booking")({
	head: () => ({ meta: [{ title: "Choose your seat — Badulla Trip" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./route-CIk8GCv4.mjs");
var Route$4 = createFileRoute("/_authenticated/admin")({
	beforeLoad: async ({ context }) => {
		const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", context.user.id).eq("role", "admin").maybeSingle();
		if (error || !data) throw redirect({ to: "/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin-BsaDGcx1.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/")({
	head: () => ({ meta: [{ title: "Admin · Overview — Badulla Trip" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./students-BfiDio3h.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/students")({
	head: () => ({ meta: [{ title: "Admin · Students — Badulla Trip" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./payments-BJKpAJ6Q.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/payments")({
	head: () => ({ meta: [{ title: "Admin · Payments — Badulla Trip" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./buses-ilze3evN.mjs");
var Route = createFileRoute("/_authenticated/admin/buses")({
	head: () => ({ meta: [{ title: "Admin · Buses — Badulla Trip" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var AuthRoute = Route$11.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$12
});
var AuthenticatedRouteRoute = Route$13.update({
	id: "/_authenticated",
	getParentRoute: () => Route$12
});
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var AuthenticatedTicketRoute = Route$9.update({
	id: "/ticket",
	path: "/ticket",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProfileRoute = Route$8.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPaymentsRoute = Route$7.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$6.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedBookingRoute = Route$5.update({
	id: "/booking",
	path: "/booking",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminRouteRoute = Route$4.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminStudentsRoute = Route$2.update({
	id: "/students",
	path: "/students",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminPaymentsRoute = Route$1.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminRouteRouteChildren = {
	AuthenticatedAdminBusesRoute: Route.update({
		id: "/buses",
		path: "/buses",
		getParentRoute: () => AuthenticatedAdminRouteRoute
	}),
	AuthenticatedAdminPaymentsRoute,
	AuthenticatedAdminStudentsRoute,
	AuthenticatedAdminIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRouteRoute: AuthenticatedAdminRouteRoute._addFileChildren(AuthenticatedAdminRouteRouteChildren),
	AuthenticatedBookingRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedPaymentsRoute,
	AuthenticatedProfileRoute,
	AuthenticatedTicketRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
