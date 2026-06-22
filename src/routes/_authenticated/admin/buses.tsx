import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Bus as BusIcon } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { BUS_CAPACITY } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/admin/buses")({
  head: () => ({ meta: [{ title: "Admin · Buses — Badulla Trip" }] }),
  component: AdminBuses,
});

type Booking = {
  bus_id: number;
  seat_number: number;
  student_id: string;
};
type Profile = { id: string; name: string | null; registration_number: string | null };

function AdminBuses() {
  const [active, setActive] = useState<number>(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-buses"],
    queryFn: async () => {
      const [{ data: buses }, { data: bookings }, { data: profiles }] = await Promise.all([
        supabase.from("buses").select("id, name, capacity").order("id"),
        supabase.from("seat_bookings").select("bus_id, seat_number, student_id"),
        supabase.from("profiles").select("id, name, registration_number"),
      ]);
      const profById = new Map((profiles ?? []).map((p) => [p.id, p as Profile]));
      const byBus = new Map<number, Map<number, { booking: Booking; profile: Profile | undefined }>>();
      (bookings ?? []).forEach((b) => {
        if (!byBus.has(b.bus_id)) byBus.set(b.bus_id, new Map());
        byBus.get(b.bus_id)!.set(b.seat_number, { booking: b as Booking, profile: profById.get(b.student_id) });
      });
      return { buses: buses ?? [], byBus };
    },
  });

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</div>
        <h1 className="mt-1 font-display text-4xl font-semibold">Bus occupancy</h1>
      </div>

      {isLoading || !data ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {data.buses.map((b) => {
              const count = data.byBus.get(b.id)?.size ?? 0;
              const pct = Math.round((count / b.capacity) * 100);
              const isActive = active === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setActive(b.id)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border/60 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BusIcon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{b.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {count}/{b.capacity} ({pct}%)
                  </div>
                  <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-gradient-ember"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="border-b border-border/60 px-5 py-3 text-sm font-medium">
              Bus {active} — passenger list
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium w-16">Seat</th>
                    <th className="px-4 py-3 font-medium">Passenger</th>
                    <th className="px-4 py-3 font-medium">Reg. No.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {Array.from({ length: BUS_CAPACITY }, (_, i) => i + 1).map((seat) => {
                    const row = data.byBus.get(active)?.get(seat);
                    return (
                      <tr key={seat} className={row ? "" : "text-muted-foreground/60"}>
                        <td className="px-4 py-2.5 font-mono">{seat}</td>
                        <td className="px-4 py-2.5">{row?.profile?.name ?? "— empty —"}</td>
                        <td className="px-4 py-2.5 font-mono text-xs">{row?.profile?.registration_number ?? ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="mt-6">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">← Admin overview</Link>
      </div>
    </main>
  );
}
