import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, MapPin, CalendarDays, Ticket } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { TRIP } from "@/lib/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Badulla Trip — Batch Trip Portal" },
      { name: "description", content: `Official portal for the ${TRIP.university} batch trip to ${TRIP.destination} on ${TRIP.date}.` },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container mx-auto px-6 py-20">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {TRIP.university}
          </div>
          <h1 className="font-display text-5xl font-semibold leading-tight sm:text-7xl">
            Road trip to <span className="text-gradient-sunset">Badulla</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Register, pay, and lock in your seat for the batch trip on{" "}
            <span className="text-foreground">{TRIP.date}</span>. Eight buses, fifty-four seats each — first paid, first served.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gradient-ember px-8 shadow-ember">
              <Link to="/auth">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border/60">
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-3">
          {[
            { icon: CalendarDays, title: TRIP.date, sub: "Trip date" },
            { icon: Bus, title: "8 buses · 432 seats", sub: "Live availability" },
            { icon: Ticket, title: "Rs. 3,000 total", sub: "Advance + Final" },
          ].map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <div className="mt-4 font-display text-xl font-semibold">{f.title}</div>
              <div className="text-sm text-muted-foreground">{f.sub}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
