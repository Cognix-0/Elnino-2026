import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Lock, Bus, User, AlertTriangle, CheckCircle } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Route as AuthRoute } from "./route";
import { BUS_CAPACITY } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/booking")({
  head: () => ({ meta: [{ title: "Choose your seat — Badulla Trip" }] }),
  component: BookingPage,
});

type Booking = {
  id: string;
  student_id: string;
  bus_id: number;
  seat_number: number;
};

function BookingPage() {
  const { user } = AuthRoute.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [activeBus, setActiveBus] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  // Modal and Confirmation States
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("advance_payment_status, name")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: buses } = useQuery({
    queryKey: ["buses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buses")
        .select("id, name, capacity")
        .order("id");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["seat_bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seat_bookings")
        .select("id, student_id, bus_id, seat_number");
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const myBooking = useMemo(
    () => bookings?.find((b) => b.student_id === user.id) ?? null,
    [bookings, user.id]
  );

  const takenByBus = useMemo(() => {
    const map = new Map<number, Map<number, Booking>>();
    bookings?.forEach((b) => {
      if (!map.has(b.bus_id)) map.set(b.bus_id, new Map());
      map.get(b.bus_id)!.set(b.seat_number, b);
    });
    return map;
  }, [bookings]);

  const approved = profile?.advance_payment_status === "approved";

  if (!approved) {
    return (
      <main className="container mx-auto max-w-2xl px-6 py-16">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Seat booking is locked</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your advance payment must be approved before you can choose a seat.
          </p>
          <Button asChild className="mt-6">
            <Link to="/payments">Go to payments</Link>
          </Button>
        </div>
      </main>
    );
  }

  // Handle opening the confirmation modal
  function handlePickSeat(seat: number) {
    if (myBooking) {
      toast.error("You already have a seat. Release it first to change.");
      return;
    }
    setSelectedSeat(seat);
    setShowConfirmModal(true);
  }

  // Handle final confirmation of seat booking
  async function confirmBooking() {
    if (!selectedSeat) return;
    setConfirmLoading(true);
    const { error } = await supabase.from("seat_bookings").insert({
      student_id: user.id,
      bus_id: activeBus,
      seat_number: selectedSeat,
    });
    setConfirmLoading(false);
    setShowConfirmModal(false);

    if (error) {
      toast("Booking Failed", {
        description: "Unable to reserve the selected seat. Please try again.",
        duration: 4000,
        position: "top-right",
        className: "bg-red-950 border border-red-500/30 text-red-200",
      });
    } else {
      toast("Booking Successful", {
        description: `Seat ${selectedSeat} on Bus ${activeBus} has been successfully reserved.`,
        icon: "✅",
        duration: 4000,
        position: "top-right",
      });
    }
    setSelectedSeat(null);
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

  return (
    <main className="container mx-auto px-6 py-10">
      <button
        onClick={() => navigate({ to: "/dashboard" })}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </button>

      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Step 3</div>
        <h1 className="mt-1 font-display text-4xl font-semibold">Choose your seat</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick any available seat on any bus. You can change it anytime before the trip.
        </p>
      </header>

      {myBooking && (
        <div className="mb-6 glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 border border-orange-500/20 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-orange-500/80">Your reserved seat</div>
            <div className="mt-1 font-display text-xl font-semibold">
              Bus {myBooking.bus_id} · Seat {myBooking.seat_number}
            </div>
          </div>
          <Button variant="outline" onClick={releaseSeat} disabled={submitting} className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Release seat"}
          </Button>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {buses?.map((b) => {
          const count = takenByBus.get(b.id)?.size ?? 0;
          const isActive = activeBus === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveBus(b.id)}
              className={`rounded-xl border px-4 py-2 text-sm transition cursor-pointer ${
                isActive
                  ? "border-orange-500 bg-orange-500/10 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="font-medium">{b.name}</span>
              <span className="ml-2 text-xs opacity-70">
                {count}/{b.capacity}
              </span>
            </button>
          );
        })}
      </div>

      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        {/* Soft Ambient blue glow backgrounds */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
        
        <Legend />
        <SeatGrid
          busId={activeBus}
          taken={takenByBus.get(activeBus) ?? new Map()}
          myUserId={user.id}
          loading={bookingsLoading}
          disabled={submitting || !!myBooking}
          onPick={handlePickSeat}
        />
      </div>

      {/* Premium Animated Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={(open) => !confirmLoading && setShowConfirmModal(open)}>
        <DialogContent className="max-w-md bg-slate-950/95 border-slate-800/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] text-slate-100 rounded-3xl p-6 sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold tracking-tight text-center">Confirm Seat Booking</DialogTitle>
            <DialogDescription className="text-sm text-slate-400 text-center mt-1">
              Please review your reservation details before proceeding.
            </DialogDescription>
          </DialogHeader>

          {confirmLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
              <p className="text-sm font-medium text-slate-300 animate-pulse">Reserving your seat...</p>
            </div>
          ) : (
            <div className="space-y-5 mt-2">
              <div className="space-y-2.5">
                {/* Bus Card */}
                <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-850 p-3.5 rounded-xl">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Bus className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Bus Information</span>
                    <span className="text-sm font-semibold text-slate-200">Bus No: {activeBus}</span>
                  </div>
                </div>

                {/* Seat Card */}
                <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-850 p-3.5 rounded-xl">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500/10 text-orange-400">
                    <span className="text-sm font-bold font-mono">💺</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Seat Information</span>
                    <span className="text-sm font-semibold text-slate-200">Seat No: {selectedSeat}</span>
                  </div>
                </div>

                {/* Passenger Card */}
                <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-850 p-3.5 rounded-xl">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-purple-500/10 text-purple-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Passenger Information</span>
                    <span className="text-sm font-semibold text-slate-200 truncate max-w-[240px] block">
                      {profile?.name || user.email || "Passenger"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning Card */}
              <div className="flex gap-3 bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl text-amber-200/90 text-xs leading-relaxed">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Once confirmed, this seat will be reserved for you and may no longer be available to others.</span>
              </div>

              <div className="text-center text-sm font-medium text-slate-300 pt-1">
                Are you sure you want to confirm this booking?
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200 h-11 rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmBooking}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] h-11 rounded-xl cursor-pointer"
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Legend() {
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-6 text-xs text-slate-400 border-b border-slate-800/40 pb-4">
      <span className="inline-flex items-center gap-2">
        <span className="h-4.5 w-4.5 rounded-md bg-[#0d1527]/80 border border-blue-500/30" /> Available
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-4.5 w-4.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_0_8px_rgba(249,115,22,0.5)] animate-pulse" /> Your seat
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-4.5 w-4.5 rounded-md bg-slate-800/40 border border-slate-700/20 opacity-40" /> Taken
      </span>
    </div>
  );
}

interface SeatRow {
  left: (number | null)[];
  right: (number | null)[];
}

function SeatGrid({
  busId,
  taken,
  myUserId,
  loading,
  disabled,
  onPick,
}: {
  busId: number;
  taken: Map<number, Booking>;
  myUserId: string;
  loading: boolean;
  disabled: boolean;
  onPick: (seat: number) => void;
}) {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="text-sm text-slate-400">Loading seat map...</span>
      </div>
    );
  }

  // Generate the rows logically according to specifications
  const mainRows: SeatRow[] = [];
  
  // Left side has 9 rows of 2. Right side has 10 rows of 3.
  for (let r = 0; r < 9; r++) {
    const base = r * 5;
    mainRows.push({
      left: [base + 1, base + 2],
      right: [base + 3, base + 4, base + 5],
    });
  }
  
  // Row 10 has no seats on the left, but 46, 47, 48 on the right
  mainRows.push({
    left: [null, null],
    right: [46, 47, 48],
  });

  // Last Row has 6 seats spanning the entire width (49 to 54)
  const backRow = [49, 50, 51, 52, 53, 54];

  return (
    <div className="mx-auto max-w-sm border-2 border-slate-800/80 rounded-[32px] bg-[#030712]/45 p-5 shadow-[0_0_40px_rgba(59,130,246,0.03)] backdrop-blur-md relative border-t-[14px] border-t-slate-700/60 border-b-[8px] border-b-slate-700/60">
      
      {/* Driver Cabin Area */}
      <div className="mb-6 flex items-center justify-between border-b border-dashed border-slate-850 pb-5">
        {/* Entry Door indicator (Sri Lankan bus Passenger entry is left side) */}
        <div className="flex items-center gap-1.5 ml-1">
          <div className="h-8 px-2.5 rounded-lg border border-emerald-500/10 bg-emerald-500/5 flex items-center justify-center text-emerald-400/60 select-none">
            <span className="text-[9px] font-bold uppercase tracking-wider">Entry Door</span>
          </div>
        </div>

        {/* Dashboard Indicator in center */}
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600 select-none">
          FRONT
        </span>

        {/* Steering Wheel & Driver seat (Sri Lankan bus Driver is right side) */}
        <div className="flex items-center gap-3 mr-1">
          <div className="flex flex-col items-end">
            <svg className="h-5 w-5 text-slate-500 rotate-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v7M2 12h7M12 15v7M15 12h7" />
            </svg>
          </div>
          <div className="h-8 w-8 rounded-lg bg-slate-800/40 border border-slate-700/30 flex items-center justify-center text-slate-500 opacity-60 select-none">
            <span className="text-[9px] font-bold">DRV</span>
          </div>
        </div>
      </div>

      {/* Seat Rows Container */}
      <div className="space-y-2.5">
        {mainRows.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-[1fr_1fr_20px_1fr_1fr_1fr] items-center gap-x-2">
            {/* Left Seats */}
            {row.left[0] !== null ? (
              <Seat n={row.left[0]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
            ) : (
              <div className="h-10" />
            )}
            {row.left[1] !== null ? (
              <Seat n={row.left[1]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
            ) : (
              <div className="h-10" />
            )}

            {/* Aisle */}
            <div className="h-full flex items-center justify-center select-none">
              <div className="w-0.5 h-full bg-slate-900/40 border-l border-dashed border-slate-800/30" />
            </div>

            {/* Right Seats */}
            {row.right[0] !== null ? (
              <Seat n={row.right[0]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
            ) : (
              <div className="h-10" />
            )}
            {row.right[1] !== null ? (
              <Seat n={row.right[1]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
            ) : (
              <div className="h-10" />
            )}
            {row.right[2] !== null ? (
              <Seat n={row.right[2]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
            ) : (
              <div className="h-10" />
            )}
          </div>
        ))}

        {/* Back Row Divider */}
        <div className="border-t border-slate-850 my-3 pt-3">
          <div className="grid grid-cols-6 gap-x-2">
            {backRow.map((seatNum) => (
              <Seat key={seatNum} n={seatNum} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 text-center text-[10px] tracking-wider uppercase text-slate-600 select-none">
        {BUS_CAPACITY} Seats total
      </div>
    </div>
  );
}

function Seat({
  n,
  taken,
  myUserId,
  disabled,
  onPick,
}: {
  n: number;
  taken: Map<number, Booking>;
  myUserId: string;
  disabled: boolean;
  onPick: (seat: number) => void;
}) {
  const booking = taken.get(n);
  const isMine = booking?.student_id === myUserId;
  const isTaken = !!booking && !isMine;

  const base = "h-10 w-full rounded-xl text-[11px] font-semibold transition-all duration-300 flex items-center justify-center";
  
  if (isMine) {
    return (
      <div className={`${base} bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] animate-pulse border-transparent select-none`}>
        {n}
      </div>
    );
  }
  
  if (isTaken) {
    return (
      <div className={`${base} bg-slate-800/40 border border-slate-700/20 text-slate-600/70 opacity-40 cursor-not-allowed select-none`}>
        {n}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onPick(n)}
      disabled={disabled}
      className={`${base} bg-[#0d1527]/80 text-blue-200 border border-blue-500/20 hover:border-blue-400 hover:bg-blue-500/10 hover:text-white hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
    >
      {n}
    </button>
  );
}

