import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CnB-OalF.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { k as Bus, p as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-NCnykc5o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function AuthPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({
				to: "/dashboard",
				replace: true
			});
		});
	}, [navigate]);
	const handleSignIn = async (e) => {
		e.preventDefault();
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Welcome back!");
		navigate({
			to: "/dashboard",
			replace: true
		});
	};
	const handleSignUp = async (e) => {
		e.preventDefault();
		setLoading(true);
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${window.location.origin}/dashboard`,
				data: { name }
			}
		});
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Account created. Check your email if confirmation is required.");
		navigate({
			to: "/profile",
			replace: true
		});
	};
	const handleGoogle = async () => {
		setLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin + "/dashboard" }
		});
		if (error) {
			setLoading(false);
			toast.error(error.message || "Google sign-in failed");
			return;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container mx-auto px-6 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-7 w-7 place-items-center rounded-lg bg-gradient-ember",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bus, { className: "h-3.5 w-3.5 text-primary-foreground" })
				}), "Badulla Trip"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto flex max-w-md flex-col px-6 pb-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card rounded-3xl p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-semibold",
						children: "Welcome aboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Sign in with your university email to continue."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "signin",
						className: "mt-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "grid w-full grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "signin",
									children: "Sign in"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "signup",
									children: "Sign up"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "signin",
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSignIn,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Email",
											id: "si-email",
											type: "email",
											value: email,
											onChange: setEmail
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Password",
											id: "si-pw",
											type: "password",
											value: password,
											onChange: setPassword
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											disabled: loading,
											className: "w-full bg-gradient-ember shadow-ember",
											children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Sign in"]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "signup",
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSignUp,
									className: "space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Full name",
											id: "su-name",
											value: name,
											onChange: setName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Email",
											id: "su-email",
											type: "email",
											value: email,
											onChange: setEmail
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Password",
											id: "su-pw",
											type: "password",
											value: password,
											onChange: setPassword
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											disabled: loading,
											className: "w-full bg-gradient-ember shadow-ember",
											children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Create account"]
										})
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
							" or ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: handleGoogle,
						disabled: loading,
						variant: "outline",
						className: "w-full border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, {}), " Continue with Google"]
					})
				]
			})
		})]
	});
}
function Field({ label, id, type = "text", value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id,
			type,
			required: true,
			value,
			onChange: (e) => onChange(e.target.value)
		})]
	});
}
function GoogleIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: "mr-2 h-4 w-4",
		viewBox: "0 0 24 24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "#EA4335",
			d: "M12 10.2v3.96h5.49c-.24 1.42-1.62 4.18-5.49 4.18-3.3 0-6-2.73-6-6.1s2.7-6.1 6-6.1c1.88 0 3.13.78 3.85 1.46l2.62-2.52C16.9 3.6 14.6 2.7 12 2.7 6.95 2.7 2.86 6.78 2.86 11.84S6.95 20.98 12 20.98c6.93 0 9.15-4.85 9.15-7.34 0-.5-.05-.88-.12-1.44H12z"
		})
	});
}
//#endregion
export { AuthPage as component };
