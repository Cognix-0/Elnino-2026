import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CnB-OalF.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as CircleX, _ as FileText, g as Funnel, p as LoaderCircle, t as X, w as CircleCheck, y as Eye } from "../_libs/lucide-react.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Route } from "./route-C3yMXaf9.mjs";
import { t as StatusPill } from "./status-pill-CvzthYE3.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DUy71i1r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-BJKpAJ6Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function AdminPayments() {
	const { user } = Route.useRouteContext();
	const qc = useQueryClient();
	const [filter, setFilter] = (0, import_react.useState)("pending");
	const [previewing, setPreviewing] = (0, import_react.useState)(null);
	const { data: slips, isLoading } = useQuery({
		queryKey: ["admin-slips", filter],
		queryFn: async () => {
			let q = supabase.from("payment_slips").select("id, student_id, payment_type, amount, slip_url, status, uploaded_at").order("uploaded_at", { ascending: false });
			if (filter !== "all") q = q.eq("status", filter);
			const { data, error } = await q;
			if (error) throw error;
			const rows = data ?? [];
			const ids = Array.from(new Set(rows.map((r) => r.student_id)));
			let profilesById = {};
			if (ids.length) {
				const { data: profs, error: pe } = await supabase.from("profiles").select("id, name, email, registration_number, department").in("id", ids);
				if (pe) throw pe;
				profilesById = Object.fromEntries((profs ?? []).map((p) => [p.id, {
					name: p.name,
					email: p.email,
					registration_number: p.registration_number,
					department: p.department
				}]));
			}
			return rows.map((r) => ({
				...r,
				profile: profilesById[r.student_id] ?? null
			}));
		}
	});
	const decide = async (slip, decision) => {
		const { error: e1 } = await supabase.from("payment_slips").update({
			status: decision,
			reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
			reviewed_by: user.id
		}).eq("id", slip.id);
		if (e1) return toast.error(e1.message);
		const { error: e2 } = await supabase.from("profiles").update(slip.payment_type === "advance" ? { advance_payment_status: decision } : { final_payment_status: decision }).eq("id", slip.student_id);
		if (e2) return toast.error(e2.message);
		toast.success(`Slip ${decision}`);
		qc.invalidateQueries({ queryKey: ["admin-slips"] });
		qc.invalidateQueries({ queryKey: ["admin-stats"] });
	};
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
						children: "Payment review"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Approve or reject uploaded payment slips. Decisions update the student instantly."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filter,
						onValueChange: (v) => setFilter(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[160px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "pending",
								children: "Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "approved",
								children: "Approved"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "rejected",
								children: "Rejected"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All"
							})
						] })]
					})]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card flex items-center gap-2 rounded-2xl p-8 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading slips…"]
			}) : !slips?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card rounded-2xl p-10 text-center text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto mb-3 h-8 w-8 text-primary" }),
					"No ",
					filter === "all" ? "" : filter,
					" slips."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "glass-card divide-y divide-border/60 overflow-hidden rounded-2xl",
				children: slips.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid items-center gap-4 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium truncate",
									children: s.profile?.name || s.profile?.email || "Unknown"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: s.status })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									s.profile?.registration_number || "—",
									" · ",
									s.profile?.department || "—",
									" ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize",
										children: s.payment_type
									}),
									" · Rs. ",
									Number(s.amount).toLocaleString(),
									" ·",
									" ",
									new Date(s.uploaded_at).toLocaleString()
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setPreviewing(s),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1.5 h-4 w-4" }), " Preview"]
						}),
						s.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "bg-primary text-primary-foreground",
								onClick: () => decide(s, "approved"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1.5 h-4 w-4" }), " Approve"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "destructive",
								onClick: () => decide(s, "rejected"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1.5 h-4 w-4" }), " Reject"]
							})]
						})
					]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlipPreview, {
				slip: previewing,
				onClose: () => setPreviewing(null),
				onDecide: decide
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					className: "text-sm text-muted-foreground hover:text-foreground",
					children: "← Back to dashboard"
				})
			})
		]
	});
}
function SlipPreview({ slip, onClose, onDecide }) {
	const [url, setUrl] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!slip) {
			setUrl(null);
			return;
		}
		setLoading(true);
		supabase.storage.from("payment-slips").createSignedUrl(slip.slip_url, 600).then(({ data, error }) => {
			if (error) toast.error(error.message);
			setUrl(data?.signedUrl ?? null);
			setLoading(false);
		});
	}, [slip]);
	const isPdf = slip?.slip_url.toLowerCase().endsWith(".pdf");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!slip,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
					slip?.profile?.name,
					" — ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "capitalize",
						children: slip?.payment_type
					}),
					" slip"
				] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[70vh] overflow-auto rounded-lg border border-border bg-background/60",
					children: loading || !url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-80 items-center justify-center text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Loading…"]
					}) : isPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: url,
						className: "h-[70vh] w-full",
						title: "slip"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: url,
						alt: "payment slip",
						className: "mx-auto max-h-[70vh] object-contain"
					})
				}),
				slip?.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						onClick: () => {
							onDecide(slip, "rejected");
							onClose();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1.5 h-4 w-4" }), " Reject"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "bg-primary text-primary-foreground",
						onClick: () => {
							onDecide(slip, "approved");
							onClose();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1.5 h-4 w-4" }), " Approve"]
					})]
				})
			]
		})
	});
}
//#endregion
export { AdminPayments as component };
