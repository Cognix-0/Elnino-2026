import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CnB-OalF.mjs";
import { o as TRIP, t as BANK } from "./constants-CmxHh-5F.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Building2, a as Upload, h as Hash, i as UserRound, m as Landmark, p as LoaderCircle, v as FileCheckCorner } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./route-C3yMXaf9.mjs";
import { t as StatusPill } from "./status-pill-CvzthYE3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-BG-rd3F3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentsPage() {
	const { user } = Route.useRouteContext();
	const qc = useQueryClient();
	const { data: profile } = useQuery({
		queryKey: ["profile", user.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const { data: slips } = useQuery({
		queryKey: ["my-slips", user.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("payment_slips").select("*").eq("student_id", user.id).order("uploaded_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const profileComplete = !!(profile?.name && profile?.registration_number && profile?.department && profile?.gender && profile?.phone && profile?.lunch_preference && profile?.dinner_preference);
	const advanceApproved = profile?.advance_payment_status === "approved";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "container mx-auto px-6 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "Payments"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-display text-4xl font-semibold",
							children: "Pay & upload slip"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Transfer to the bank account below, then upload your slip. We'll verify it manually."
						})
					]
				}),
				!profileComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass-card mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm",
						children: "Complete your profile before uploading payment slips."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "bg-gradient-ember shadow-ember",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile",
							children: "Complete profile"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-5 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlipCard, {
						type: "advance",
						title: "Phase 1 — Advance",
						amount: TRIP.advanceAmount,
						description: "Rs. 1,000 to confirm your spot and unlock seat booking.",
						status: profile?.advance_payment_status ?? "not_uploaded",
						disabled: !profileComplete,
						latestSlipPath: slips?.find((s) => s.payment_type === "advance")?.slip_url,
						onUploaded: () => qc.invalidateQueries(),
						studentId: user.id
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlipCard, {
						type: "final",
						title: "Phase 2 — Final",
						amount: TRIP.finalAmount,
						description: "Rs. 2,000 to unlock your ticket. Requires approved advance payment.",
						status: profile?.final_payment_status ?? "not_uploaded",
						disabled: !profileComplete || !advanceApproved,
						disabledReason: !advanceApproved ? "Advance payment must be approved first." : void 0,
						latestSlipPath: slips?.find((s) => s.payment_type === "final")?.slip_url,
						onUploaded: () => qc.invalidateQueries(),
						studentId: user.id
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlipHistory, { slips: slips ?? [] })
			]
		})
	});
}
function BankCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card rounded-3xl p-6 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "h-3.5 w-3.5 text-primary" }), " Bank deposit"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-2xl font-semibold",
				children: "Transfer details"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankRow, {
						icon: Building2,
						label: "Bank",
						value: BANK.bankName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankRow, {
						icon: Building2,
						label: "Branch",
						value: BANK.branch
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankRow, {
						icon: Hash,
						label: "Account number",
						value: BANK.accountNumber,
						copy: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankRow, {
						icon: UserRound,
						label: "Account holder",
						value: BANK.accountHolder
					})
				]
			})
		]
	});
}
function BankRow({ icon: Icon, label, value, copy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3 rounded-2xl border border-border/60 bg-background/40 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 h-4 w-4 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 break-all font-medium",
					children: value
				})]
			}),
			copy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					navigator.clipboard.writeText(value);
					toast.success("Copied");
				},
				className: "rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted/40",
				children: "Copy"
			})
		]
	});
}
function SlipCard({ type, title, amount, description, status, disabled, disabledReason, latestSlipPath, onUploaded, studentId }) {
	const fileRef = (0, import_react.useRef)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const handleFile = async (file) => {
		if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
		if (!/^(image\/(png|jpe?g|webp)|application\/pdf)$/i.test(file.type)) return toast.error("PNG, JPG, WEBP or PDF only");
		setUploading(true);
		const ext = file.name.split(".").pop() || "bin";
		const path = `${studentId}/${type}-${Date.now()}.${ext}`;
		const up = await supabase.storage.from("payment-slips").upload(path, file, { upsert: false });
		if (up.error) {
			setUploading(false);
			return toast.error(up.error.message);
		}
		const ins = await supabase.from("payment_slips").insert({
			student_id: studentId,
			payment_type: type,
			amount,
			slip_url: path,
			status: "pending"
		});
		if (ins.error) {
			setUploading(false);
			return toast.error(ins.error.message);
		}
		const upd = await supabase.from("profiles").update(type === "advance" ? { advance_payment_status: "pending" } : { final_payment_status: "pending" }).eq("id", studentId);
		setUploading(false);
		if (upd.error) return toast.error(upd.error.message);
		toast.success("Slip uploaded — awaiting admin review");
		onUploaded();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-card flex flex-col rounded-3xl p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 text-2xl font-semibold text-gradient-sunset",
					children: ["Rs. ", amount.toLocaleString()]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: description
			}),
			latestSlipPath && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-2 rounded-lg bg-background/40 px-3 py-2 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "h-3.5 w-3.5 text-primary" }),
					"Last upload: ",
					latestSlipPath.split("/").pop()
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/png,image/jpeg,image/webp,application/pdf",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (f) handleFile(f);
					e.target.value = "";
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => fileRef.current?.click(),
				disabled: disabled || uploading || status === "approved",
				className: "mt-5 w-full bg-gradient-ember shadow-ember",
				children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), status === "approved" ? "Approved" : status === "pending" ? "Re-upload slip" : "Upload slip"]
			}),
			disabled && disabledReason && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-center text-xs text-muted-foreground",
				children: disabledReason
			})
		]
	});
}
function SlipHistory({ slips }) {
	if (!slips.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 font-display text-lg font-semibold",
			children: "Upload history"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass-card divide-y divide-border/60 overflow-hidden rounded-2xl",
			children: slips.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-5 py-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-medium capitalize",
					children: [s.payment_type, " payment"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						new Date(s.uploaded_at).toLocaleString(),
						" · Rs. ",
						Number(s.amount).toLocaleString()
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: s.status })]
			}, s.id))
		})]
	});
}
//#endregion
export { PaymentsPage as component };
