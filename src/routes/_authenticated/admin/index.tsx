import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Wallet, Bus, CheckCircle2, Clock, XCircle, Ticket } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { BUS_CAPACITY, TRIP } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin · Overview — Badulla Trip" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, slips, bookings, buses] = await Promise.all([
        supabase.from("profiles").select("id, advance_payment_status, final_payment_status"),
        supabase.from("payment_slips").select("id, status, amount"),
        supabase.from("seat_bookings").select("id, bus_id"),
        supabase.from("buses").select("id, capacity"),
      ]);

      const p = profiles.data ?? [];
      const s = slips.data ?? [];
      const b = bookings.data ?? [];
      const bs = buses.data ?? [];

      const totalCapacity = bs.reduce((a, x) => a + x.capacity, 0);
      const advanceApproved = p.filter((x) => x.advance_payment_status === "approved").length;
      const finalApproved = p.filter((x) => x.final_payment_status === "approved").length;
      const totalCollected = s
        .filter((x) => x.status === "approved")
        .reduce((a, x) => a + Number(x.amount), 0);

      return {
        students: p.length,
        slipsPending: s.filter((x) => x.status === "pending").length,
        slipsApproved: s.filter((x) => x.status === "approved").length,
        slipsRejected: s.filter((x) => x.status === "rejected").length,
        advanceApproved,
        finalApproved,
        seatsBooked: b.length,
        totalCapacity,
        totalCollected,
      };
    },
  });

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</div>
        <h1 className="mt-1 font-display text-4xl font-semibold">Trip Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {TRIP.destination} · {TRIP.date}
        </p>
      </div>

      {isLoading || !stats ? (
        <div className="text-sm text-muted-foreground">Loading stats…</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Users} label="Registered students" value={stats.students} />
            <Stat icon={CheckCircle2} label="Advance approved" value={stats.advanceApproved} />
            <Stat icon={Ticket} label="Seats booked" value={`${stats.seatsBooked}/${stats.totalCapacity}`} />
            <Stat icon={Wallet} label="Total collected (Rs.)" value={stats.totalCollected.toLocaleString()} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SlipBox label="Pending slips" value={stats.slipsPending} icon={Clock} cls="text-cream" />
            <SlipBox label="Approved slips" value={stats.slipsApproved} icon={CheckCircle2} cls="text-primary" />
            <SlipBox label="Rejected slips" value={stats.slipsRejected} icon={XCircle} cls="text-destructive" />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <AdminLink to="/admin/payments" icon={Wallet} title="Payment slips" desc="Review uploaded slips" />
            <AdminLink to="/admin/students" icon={Users} title="Students" desc="All registered students" />
            <AdminLink to="/admin/buses" icon={Bus} title="Buses" desc="Seat occupancy by bus" />
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            Total capacity: {stats.totalCapacity} seats · {BUS_CAPACITY} per bus.
          </div>
        </>
      )}
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number | string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-3 font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}

function SlipBox({ label, value, icon: Icon, cls }: { label: string; value: number; icon: typeof Clock; cls: string }) {
  return (
    <div className="glass-card flex items-center justify-between rounded-2xl p-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
      </div>
      <Icon className={`h-7 w-7 ${cls}`} />
    </div>
  );
}

function AdminLink({ to, icon: Icon, title, desc }: { to: string; icon: typeof Users; title: string; desc: string }) {
  return (
    <Link to={to} className="glass-card group rounded-2xl p-5 transition hover:border-primary/60">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-ember shadow-ember">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
    </Link>
  );
}
