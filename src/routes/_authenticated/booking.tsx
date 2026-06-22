import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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

  async function bookSeat(busId: number, seat: number) {
    if (myBooking) {
      toast.error("You already have a seat. Release it first to change.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("seat_bookings").insert({
      student_id: user.id,
      bus_id: busId,
      seat_number: seat,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "That seat was just taken." : error.message);
    } else {
      toast.success(`Seat ${seat} on Bus ${busId} booked!`);
    }
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
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
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
        <div className="mb-6 glass-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your seat</div>
            <div className="mt-1 font-display text-xl font-semibold">
              Bus {myBooking.bus_id} · Seat {myBooking.seat_number}
            </div>
          </div>
          <Button variant="outline" onClick={releaseSeat} disabled={submitting}>
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
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-primary bg-primary/10 text-foreground"
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

      <div className="glass-card rounded-2xl p-6">
        <Legend />
        <SeatGrid
          busId={activeBus}
          taken={takenByBus.get(activeBus) ?? new Map()}
          myUserId={user.id}
          loading={bookingsLoading}
          disabled={submitting || !!myBooking}
          onPick={(seat) => bookSeat(activeBus, seat)}
        />
      </div>
    </main>
  );
}

function Legend() {
  return (
    <div className="mb-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
      <LegendDot className="bg-muted border border-border" label="Available" />
      <LegendDot className="bg-gradient-ember" label="Your seat" />
      <LegendDot className="bg-muted/40 border border-border/50" label="Taken" />
    </div>
  );
}
function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-4 w-4 rounded ${className}`} /> {label}
    </span>
  );
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
    return <div className="py-10 text-center text-sm text-muted-foreground">Loading seats…</div>;
  }
  // 50 seats: 13 rows of 4 (2+aisle+2) = 52 → use 12 rows of 4 + last row of 5; simpler: rows of 4, 12 rows + 2 back
  const rows: number[][] = [];
  let n = 1;
  for (let r = 0; r < 12; r++) {
    rows.push([n, n + 1, n + 2, n + 3]);
    n += 4;
  }
  rows.push([n, n + 1]); // 49, 50

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 rounded-xl border border-dashed border-border/50 px-4 py-2 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Bus {busId} · Driver ↑
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_24px_1fr_1fr] items-center gap-2">
            {row.length === 4 ? (
              <>
                <Seat n={row[0]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
                <Seat n={row[1]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
                <div />
                <Seat n={row[2]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
                <Seat n={row[3]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
              </>
            ) : (
              <>
                <Seat n={row[0]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
                <div />
                <div />
                <div />
                <Seat n={row[1]} taken={taken} myUserId={myUserId} disabled={disabled} onPick={onPick} />
              </>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        {BUS_CAPACITY} seats total
      </p>
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

  const base = "h-10 rounded-lg text-xs font-medium transition";
  if (isMine) {
    return (
      <div className={`${base} bg-gradient-ember text-primary-foreground shadow-ember grid place-items-center`}>
        {n}
      </div>
    );
  }
  if (isTaken) {
    return (
      <div className={`${base} bg-muted/40 text-muted-foreground/60 border border-border/50 grid place-items-center cursor-not-allowed`}>
        {n}
      </div>
    );
  }
  return (
    <button
      onClick={() => onPick(n)}
      disabled={disabled}
      className={`${base} bg-muted border border-border hover:border-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {n}
    </button>
  );
}
