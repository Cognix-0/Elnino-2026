import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CnB-OalF.mjs";
import { a as LUNCH, i as GENDERS, n as DEPARTMENTS, r as DINNER } from "./constants-CmxHh-5F.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { p as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Label } from "./label-B4PTMSG2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./route-C3yMXaf9.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CuQUUj0c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	name: "",
	registration_number: "",
	department: "",
	gender: "",
	phone: "",
	lunch_preference: "",
	dinner_preference: ""
};
function ProfilePage() {
	const { user } = Route.useRouteContext();
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)(empty);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const { data: profile, isLoading } = useQuery({
		queryKey: ["profile", user.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	(0, import_react.useEffect)(() => {
		if (!profile) return;
		setForm({
			name: profile.name ?? "",
			registration_number: profile.registration_number ?? "",
			department: profile.department ?? "",
			gender: profile.gender ?? "",
			phone: profile.phone ?? "",
			lunch_preference: profile.lunch_preference ?? "",
			dinner_preference: profile.dinner_preference ?? ""
		});
	}, [profile]);
	const update = (k, v) => setForm((p) => ({
		...p,
		[k]: v
	}));
	const onSubmit = async (e) => {
		e.preventDefault();
		if (!form.name.trim() || form.name.length > 120) return toast.error("Enter your name");
		if (!form.registration_number.trim() || form.registration_number.length > 40) return toast.error("Enter your registration number");
		if (!/^[0-9+\-\s]{7,20}$/.test(form.phone)) return toast.error("Enter a valid phone number");
		if (!form.department || !form.gender || !form.lunch_preference || !form.dinner_preference) return toast.error("Please complete all fields");
		setSaving(true);
		const { error } = await supabase.from("profiles").update({
			name: form.name.trim(),
			registration_number: form.registration_number.trim(),
			department: form.department,
			gender: form.gender,
			phone: form.phone.trim(),
			lunch_preference: form.lunch_preference,
			dinner_preference: form.dinner_preference
		}).eq("id", user.id);
		setSaving(false);
		if (error) return toast.error(error.message);
		toast.success("Profile saved");
		qc.invalidateQueries({ queryKey: ["profile", user.id] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "container mx-auto px-6 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: "Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-semibold",
						children: "Your profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Fill in your trip details. You can update these any time before payment is approved."
					})
				]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card flex items-center gap-2 rounded-2xl p-8 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading…"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "glass-card grid gap-5 rounded-3xl p-8 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Full name",
						v: form.name,
						on: (v) => update("name", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Registration number",
						v: form.registration_number,
						on: (v) => update("registration_number", v)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
						label: "Department",
						v: form.department,
						on: (v) => update("department", v),
						options: DEPARTMENTS
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
						label: "Gender",
						v: form.gender,
						on: (v) => update("gender", v),
						options: GENDERS
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						label: "Phone",
						v: form.phone,
						on: (v) => update("phone", v),
						type: "tel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: user.email ?? "",
							disabled: true,
							className: "mt-1.5"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
						label: "Lunch preference",
						v: form.lunch_preference,
						on: (v) => update("lunch_preference", v),
						options: LUNCH
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pick, {
						label: "Dinner preference",
						v: form.dinner_preference,
						on: (v) => update("dinner_preference", v),
						options: DINNER
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: saving,
							className: "w-full bg-gradient-ember shadow-ember",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Save profile"]
						})
					})
				]
			})]
		})
	});
}
function Text({ label, v, on, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		type,
		value: v,
		onChange: (e) => on(e.target.value),
		className: "mt-1.5"
	})] });
}
function Pick({ label, v, on, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: v,
		onValueChange: on,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: "mt-1.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: `Select ${label.toLowerCase()}` })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: o,
			children: o
		}, o)) })]
	})] });
}
//#endregion
export { ProfilePage as component };
