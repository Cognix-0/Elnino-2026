import { t as supabase } from "./client-CnB-OalF.mjs";
import { o as TRIP } from "./constants-CmxHh-5F.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { C as CircleX, k as Bus, l as Printer, o as Ticket, w as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Route } from "./route-C3yMXaf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ticket-C-S-oIs0.js
var import_jsx_runtime = require_jsx_runtime();
function TicketPage() {
	const { user } = Route.useRouteContext();
	const { data, isLoading } = useQuery({
		queryKey: ["ticket", user.id],
		queryFn: async () => {
			const [{ data: profile }, { data: booking }] = await Promise.all([supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(), supabase.from("seat_bookings").select("bus_id, seat_number, booked_at").eq("student_id", user.id).maybeSingle()]);
			return {
				profile,
				booking
			};
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "container mx-auto px-6 py-16 text-center text-muted-foreground",
		children: "Loading your ticket…"
	});
	const profile = data?.profile;
	const booking = data?.booking;
	const profileComplete = !!(profile?.name && profile?.registration_number && profile?.department && profile?.gender && profile?.phone);
	const advanceOk = profile?.advance_payment_status === "approved";
	const hasSeat = !!booking;
	const finalOk = profile?.final_payment_status === "approved";
	const valid = profileComplete && advanceOk && hasSeat;
	const paymentStatusLabel = finalOk ? "Fully paid" : advanceOk ? "Advance paid" : "Unpaid";
	const ticketId = `BT-${(profile?.id ?? "").slice(0, 8).toUpperCase()}`;
	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(JSON.stringify({
		id: ticketId,
		name: profile?.name,
		reg: profile?.registration_number,
		bus: booking?.bus_id,
		seat: booking?.seat_number,
		valid
	}))}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container mx-auto max-w-3xl px-6 py-10 print:py-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard",
					className: "text-sm text-muted-foreground hover:text-foreground",
					children: "← Back to dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => window.print(),
					variant: "outline",
					size: "sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-1.5 h-4 w-4" }), " Print"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ticket glass-card overflow-hidden rounded-3xl print:rounded-none print:shadow-none print:border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative bg-gradient-ember px-8 py-6 text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-[0.25em] opacity-80",
									children: "Boarding Pass"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-1 font-display text-2xl font-semibold",
									children: "Badulla Batch Trip"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs opacity-90",
									children: TRIP.university
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-12 w-12 place-items-center rounded-2xl bg-background/15 backdrop-blur",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "h-6 w-6" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid grid-cols-2 gap-4 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "opacity-75",
								children: "Destination"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-base font-semibold",
								children: TRIP.destination
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "opacity-75",
									children: "Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-base font-semibold",
									children: TRIP.date
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center justify-between px-8 py-3 text-sm font-medium ${valid ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2",
							children: [valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }), valid ? "Valid Ticket" : "Invalid Ticket"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs opacity-80",
							children: ticketId
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 px-8 py-7 sm:grid-cols-[1fr_auto]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Name",
									value: profile?.name || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Reg. No.",
										value: profile?.registration_number || "—"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Department",
										value: profile?.department || "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Bus",
										value: booking ? `Bus ${booking.bus_id}` : "Not booked",
										icon: Bus
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Seat",
										value: booking ? `#${booking.seat_number}` : "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Payment status",
									value: paymentStatusLabel
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl border border-border bg-white p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: qrUrl,
									alt: "ticket QR",
									width: 140,
									height: 140
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
								children: "Scan at boarding"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative border-t border-dashed border-border/70 bg-background/40 px-8 py-4 text-[11px] text-muted-foreground",
						children: [
							"Present this ticket at the bus door. Keep until you reach ",
							TRIP.destination,
							"."
						]
					})
				]
			}),
			!valid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 glass-card rounded-2xl p-5 text-sm text-muted-foreground print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium text-foreground",
					children: "Make your ticket valid:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 list-disc space-y-1 pl-5",
					children: [
						!profileComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Complete your ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								className: "underline",
								to: "/profile",
								children: "profile"
							}),
							"."
						] }),
						!advanceOk && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Get your ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								className: "underline",
								to: "/payments",
								children: "advance payment"
							}),
							" approved."
						] }),
						!hasSeat && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "underline",
							to: "/booking",
							children: "Book a seat"
						}), "."] })
					]
				})]
			})
		]
	});
}
function Field({ label, value, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-1 inline-flex items-center gap-1.5 font-display text-lg font-semibold",
		children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }), value]
	})] });
}
//#endregion
export { TicketPage as component };
