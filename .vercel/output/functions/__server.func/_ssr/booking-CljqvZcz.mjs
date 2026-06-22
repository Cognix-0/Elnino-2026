import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CnB-OalF.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { f as Lock, j as ArrowLeft, p as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./route-C3yMXaf9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/booking-CljqvZcz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BookingPage() {
	const { user } = Route.useRouteContext();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [activeBus, setActiveBus] = (0, import_react.useState)(1);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const { data: profile } = useQuery({
		queryKey: ["profile", user.id],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("advance_payment_status, name").eq("id", user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const { data: buses } = useQuery({
		queryKey: ["buses"],
		queryFn: async () => {
			const { data, error } = await supabase.from("buses").select("id, name, capacity").order("id");
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: bookings, isLoading: bookingsLoading } = useQuery({
		queryKey: ["seat_bookings"],
		queryFn: async () => {
			const { data, error } = await supabase.from("seat_bookings").select("id, student_id, bus_id, seat_number");
			if (error) throw error;
			return data ?? [];
		}
	});
	const myBooking = (0, import_react.useMemo)(() => bookings?.find((b) => b.student_id === user.id) ?? null, [bookings, user.id]);
	const takenByBus = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		bookings?.forEach((b) => {
			if (!map.has(b.bus_id)) map.set(b.bus_id, /* @__PURE__ */ new Map());
			map.get(b.bus_id).set(b.seat_number, b);
		});
		return map;
	}, [bookings]);
	if (!(profile?.advance_payment_status === "approved")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "container mx-auto max-w-2xl px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card rounded-2xl p-8 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Seat booking is locked"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Your advance payment must be approved before you can choose a seat."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/payments",
						children: "Go to payments"
					})
				})
			]
		})
	});
	async function bookSeat(busId, seat) {
		if (myBooking) {
			toast.error("You already have a seat. Release it first to change.");
			return;
		}
		setSubmitting(true);
		const { error } = await supabase.from("seat_bookings").insert({
			student_id: user.id,
			bus_id: busId,
			seat_number: seat
		});
		setSubmitting(false);
		if (error) toast.error(error.message.includes("duplicate") ? "That seat was just taken." : error.message);
		else toast.success(`Seat ${seat} on Bus ${busId} booked!`);
		qc.invalidateQueries({ queryKey: ["seat_bookings"] });
	}
	async function releaseSeat() {
		if (!myBooking) return;
		setSubmitting(true);
		const { error } = await supabase.from("seat_bookings").delete().eq("id", myBooking.id);
		setSubmitting(false);
		if (error) toast.error(error.message);
		else toast.success("Seat released.");
		qc.invalidateQueries({ queryKey: ["seat_bookings"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container mx-auto px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => navigate({ to: "/dashboard" }),
				className: "mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to dashboard"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: "Step 3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl font-semibold",
						children: "Choose your seat"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Pick any available seat on any bus. You can change it anytime before the trip."
					})
				]
			}),
			myBooking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
					children: "Your seat"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 font-display text-xl font-semibold",
					children: [
						"Bus ",
						myBooking.bus_id,
						" · Seat ",
						myBooking.seat_number
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: releaseSeat,
					disabled: submitting,
					children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Release seat"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex flex-wrap gap-2",
				children: buses?.map((b) => {
					const count = takenByBus.get(b.id)?.size ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveBus(b.id),
						className: `rounded-xl border px-4 py-2 text-sm transition ${activeBus === b.id ? "border-primary bg-primary/10 text-foreground" : "border-border/60 text-muted-foreground hover:text-foreground"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: b.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-xs opacity-70",
							children: [
								count,
								"/",
								b.capacity
							]
						})]
					}, b.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card rounded-2xl p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatGrid, {
					busId: activeBus,
					taken: takenByBus.get(activeBus) ?? /* @__PURE__ */ new Map(),
					myUserId: user.id,
					loading: bookingsLoading,
					disabled: submitting || !!myBooking,
					onPick: (seat) => bookSeat(activeBus, seat)
				})]
			})
		]
	});
}
function Legend() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5 flex flex-wrap gap-4 text-xs text-muted-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
				className: "bg-muted border border-border",
				label: "Available"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
				className: "bg-gradient-ember",
				label: "Your seat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegendDot, {
				className: "bg-muted/40 border border-border/50",
				label: "Taken"
			})
		]
	});
}
function LegendDot({ className, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-4 w-4 rounded ${className}` }),
			" ",
			label
		]
	});
}
function SeatGrid({ busId, taken, myUserId, loading, disabled, onPick }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-10 text-center text-sm text-muted-foreground",
		children: "Loading seats…"
	});
	const rows = [];
	let n = 1;
	for (let r = 0; r < 12; r++) {
		rows.push([
			n,
			n + 1,
			n + 2,
			n + 3
		]);
		n += 4;
	}
	rows.push([n, n + 1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-xl border border-dashed border-border/50 px-4 py-2 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground",
				children: [
					"Bus ",
					busId,
					" · Driver ↑"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-[1fr_1fr_24px_1fr_1fr] items-center gap-2",
					children: row.length === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seat, {
							n: row[0],
							taken,
							myUserId,
							disabled,
							onPick
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seat, {
							n: row[1],
							taken,
							myUserId,
							disabled,
							onPick
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seat, {
							n: row[2],
							taken,
							myUserId,
							disabled,
							onPick
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seat, {
							n: row[3],
							taken,
							myUserId,
							disabled,
							onPick
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seat, {
							n: row[0],
							taken,
							myUserId,
							disabled,
							onPick
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Seat, {
							n: row[1],
							taken,
							myUserId,
							disabled,
							onPick
						})
					] })
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-center text-xs text-muted-foreground",
				children: [50, " seats total"]
			})
		]
	});
}
function Seat({ n, taken, myUserId, disabled, onPick }) {
	const booking = taken.get(n);
	const isMine = booking?.student_id === myUserId;
	const isTaken = !!booking && !isMine;
	const base = "h-10 rounded-lg text-xs font-medium transition";
	if (isMine) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${base} bg-gradient-ember text-primary-foreground shadow-ember grid place-items-center`,
		children: n
	});
	if (isTaken) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${base} bg-muted/40 text-muted-foreground/60 border border-border/50 grid place-items-center cursor-not-allowed`,
		children: n
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => onPick(n),
		disabled,
		className: `${base} bg-muted border border-border hover:border-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed`,
		children: n
	});
}
//#endregion
export { BookingPage as component };
