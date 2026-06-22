import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Printer, Bus, Ticket as TicketIcon } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Route as AuthRoute } from "./route";
import { TRIP } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/ticket")({
  head: () => ({ meta: [{ title: "Your Ticket — Badulla Trip" }] }),
  component: TicketPage,
});

function TicketPage() {
  const { user } = AuthRoute.useRouteContext();

  const { data, isLoading } = useQuery({
    queryKey: ["ticket", user.id],
    queryFn: async () => {
      const [{ data: profile }, { data: booking }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase
          .from("seat_bookings")
          .select("bus_id, seat_number, booked_at")
          .eq("student_id", user.id)
          .maybeSingle(),
      ]);
      return { profile, booking };
    },
  });

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-16 text-center text-muted-foreground">
        Loading your ticket…
      </main>
    );
  }

  const profile = data?.profile;
  const booking = data?.booking;

  const profileComplete = !!(
    profile?.name && profile?.registration_number && profile?.department &&
    profile?.gender && profile?.phone
  );
  const advanceOk = profile?.advance_payment_status === "approved";
  const hasSeat = !!booking;
  const finalOk = profile?.final_payment_status === "approved";

  const valid = profileComplete && advanceOk && hasSeat;

  const paymentStatusLabel = finalOk
    ? "Fully paid"
    : advanceOk
    ? "Advance paid"
    : "Unpaid";

  const ticketId = `BT-${(profile?.id ?? "").slice(0, 8).toUpperCase()}`;
  const qrPayload = encodeURIComponent(
    JSON.stringify({
      id: ticketId,
      name: profile?.name,
      reg: profile?.registration_number,
      bus: booking?.bus_id,
      seat: booking?.seat_number,
      valid,
    })
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${qrPayload}`;

  return (
    <main className="container mx-auto max-w-3xl px-6 py-10 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to dashboard
        </Link>
        <Button onClick={() => window.print()} variant="outline" size="sm">
          <Printer className="mr-1.5 h-4 w-4" /> Print
        </Button>
      </div>

      <div className="ticket glass-card overflow-hidden rounded-3xl print:rounded-none print:shadow-none print:border">
        {/* Header band */}
        <div className="relative bg-gradient-ember px-8 py-6 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-80">Boarding Pass</div>
              <h1 className="mt-1 font-display text-2xl font-semibold">Badulla Batch Trip</h1>
              <p className="text-xs opacity-90">{TRIP.university}</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-background/15 backdrop-blur">
              <TicketIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="opacity-75">Destination</div>
              <div className="mt-0.5 text-base font-semibold">{TRIP.destination}</div>
            </div>
            <div className="text-right">
              <div className="opacity-75">Date</div>
              <div className="mt-0.5 text-base font-semibold">{TRIP.date}</div>
            </div>
          </div>
        </div>

        {/* Validity strip */}
        <div className={`flex items-center justify-between px-8 py-3 text-sm font-medium ${
          valid ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
        }`}>
          <span className="inline-flex items-center gap-2">
            {valid ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {valid ? "Valid Ticket" : "Invalid Ticket"}
          </span>
          <span className="font-mono text-xs opacity-80">{ticketId}</span>
        </div>

        {/* Body */}
        <div className="grid gap-8 px-8 py-7 sm:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <Field label="Name" value={profile?.name || "—"} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Reg. No." value={profile?.registration_number || "—"} />
              <Field label="Department" value={profile?.department || "—"} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Bus"
                value={booking ? `Bus ${booking.bus_id}` : "Not booked"}
                icon={Bus}
              />
              <Field
                label="Seat"
                value={booking ? `#${booking.seat_number}` : "—"}
              />
            </div>
            <Field label="Payment status" value={paymentStatusLabel} />
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="rounded-2xl border border-border bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="ticket QR" width={140} height={140} />
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Scan at boarding
            </div>
          </div>
        </div>

        {/* Perforation footer */}
        <div className="relative border-t border-dashed border-border/70 bg-background/40 px-8 py-4 text-[11px] text-muted-foreground">
          Present this ticket at the bus door. Keep until you reach {TRIP.destination}.
        </div>
      </div>

      {!valid && (
        <div className="mt-6 glass-card rounded-2xl p-5 text-sm text-muted-foreground print:hidden">
          <div className="font-medium text-foreground">Make your ticket valid:</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {!profileComplete && <li>Complete your <Link className="underline" to="/profile">profile</Link>.</li>}
            {!advanceOk && <li>Get your <Link className="underline" to="/payments">advance payment</Link> approved.</li>}
            {!hasSeat && <li><Link className="underline" to="/booking">Book a seat</Link>.</li>}
          </ul>
        </div>
      )}
    </main>
  );
}

function Field({
  label, value, icon: Icon,
}: { label: string; value: string; icon?: typeof Bus }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 inline-flex items-center gap-1.5 font-display text-lg font-semibold">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {value}
      </div>
    </div>
  );
}
