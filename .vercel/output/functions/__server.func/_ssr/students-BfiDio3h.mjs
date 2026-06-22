import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CnB-OalF.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as Download, c as Search } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as StatusPill } from "./status-pill-CvzthYE3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students-BfiDio3h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminStudents() {
	const [q, setQ] = (0, import_react.useState)("");
	const { data: rows, isLoading } = useQuery({
		queryKey: ["admin-students"],
		queryFn: async () => {
			const [{ data: profiles, error: pe }, { data: bookings, error: be }] = await Promise.all([supabase.from("profiles").select("*").order("created_at", { ascending: false }), supabase.from("seat_bookings").select("student_id, bus_id, seat_number")]);
			if (pe) throw pe;
			if (be) throw be;
			const byStudent = new Map((bookings ?? []).map((b) => [b.student_id, b]));
			return (profiles ?? []).map((p) => ({
				...p,
				bus_id: byStudent.get(p.id)?.bus_id ?? null,
				seat_number: byStudent.get(p.id)?.seat_number ?? null
			}));
		}
	});
	const filtered = (0, import_react.useMemo)(() => {
		if (!rows) return [];
		const term = q.trim().toLowerCase();
		if (!term) return rows;
		return rows.filter((r) => [
			r.name,
			r.email,
			r.registration_number,
			r.department,
			r.phone
		].filter(Boolean).some((v) => String(v).toLowerCase().includes(term)));
	}, [rows, q]);
	function exportCsv() {
		if (!filtered.length) return;
		const headers = [
			"Name",
			"Email",
			"Reg No",
			"Department",
			"Phone",
			"Lunch",
			"Dinner",
			"Advance",
			"Final",
			"Bus",
			"Seat"
		];
		const lines = filtered.map((r) => [
			r.name,
			r.email,
			r.registration_number,
			r.department,
			r.phone,
			r.lunch_preference,
			r.dinner_preference,
			r.advance_payment_status,
			r.final_payment_status,
			r.bus_id,
			r.seat_number
		].map((v) => `"${(v ?? "").toString().replace(/"/g, "\"\"")}"`).join(","));
		const csv = [headers.join(","), ...lines].join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "students.csv";
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container mx-auto px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: "Admin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-semibold",
						children: "Students"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							rows?.length ?? 0,
							" registered · ",
							filtered.length,
							" shown"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search name, reg no, email…",
							value: q,
							onChange: (e) => setQ(e.target.value),
							className: "w-[260px] pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: exportCsv,
						variant: "outline",
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-4 w-4" }), " CSV"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass-card overflow-hidden rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Student" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Reg No" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Department" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Advance" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Final" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Seat" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Th, { children: "Meals" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "p-6 text-center text-muted-foreground",
								children: "Loading…"
							}) }) : !filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "p-6 text-center text-muted-foreground",
								children: "No students."
							}) }) : filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: r.name || "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: r.email
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
										className: "font-mono text-xs",
										children: r.registration_number || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.department || "—" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: r.advance_payment_status ?? "pending" }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: r.final_payment_status ?? "pending" }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: r.bus_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: [
											"Bus ",
											r.bus_id,
											" · #",
											r.seat_number
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "—"
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
										className: "text-xs text-muted-foreground",
										children: [
											r.lunch_preference || "—",
											" / ",
											r.dinner_preference || "—"
										]
									})
								]
							}, r.id))
						})]
					})
				})
			}),
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
function Th({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: "px-4 py-3 font-medium",
		children
	});
}
function Td({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: `px-4 py-3 align-middle ${className}`,
		children
	});
}
//#endregion
export { AdminStudents as component };
