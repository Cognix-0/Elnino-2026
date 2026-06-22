import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, Clock, XCircle, User2, Wallet, Ticket } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Route as AuthRoute } from "./route";
import { TRIP } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Badulla Trip" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = AuthRoute.useRouteContext();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const profileComplete = !!(
    profile?.name &&
    profile?.registration_number &&
    profile?.department &&
    profile?.gender &&
    profile?.phone &&
    profile?.lunch_preference &&
    profile?.dinner_preference
  );

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome</div>
        <h1 className="mt-1 font-display text-4xl font-semibold">
          {profile?.name || user.email}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trip to {TRIP.destination} · {TRIP.date}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StepCard
          icon={User2}
          title="1. Complete your profile"
          status={profileComplete ? "done" : "todo"}
          desc="Add your registration number, department, gender, phone and meal preferences."
          cta={profileComplete ? "Edit profile" : "Complete profile"}
          to="/profile"
        />
        <StepCard
          icon={Wallet}
          title="2. Advance payment"
          status={mapPayment(profile?.advance_payment_status)}
          desc={`Pay Rs.${TRIP.advanceAmount.toLocaleString()} and upload your slip to unlock seat booking.`}
          cta="Upload slip"
          to="/payments"
          disabled={!profileComplete}
        />
        <StepCard
          icon={Ticket}
          title="3. Book your seat"
          status={profile?.advance_payment_status === "approved" ? "todo" : "locked"}
          desc="Choose your bus and seat after your advance payment is approved."
          cta="Choose seat"
          to="/dashboard"
          disabled={profile?.advance_payment_status !== "approved"}
        />

      </div>

      {isLoading && (
        <p className="mt-6 text-sm text-muted-foreground">Loading your data…</p>
      )}

      <div className="mt-10 glass-card rounded-2xl p-6 text-sm text-muted-foreground">
        Bus booking, payment uploads and tickets ship in the next phase. Finish your profile so you're ready to roll.
      </div>
    </main>
  );
}

type Status = "done" | "pending" | "rejected" | "todo" | "locked";

function mapPayment(s?: string | null): Status {
  if (s === "approved") return "done";
  if (s === "pending") return "pending";
  if (s === "rejected") return "rejected";
  return "todo";
}

function StepCard({
  icon: Icon, title, status, desc, cta, to, disabled,
}: {
  icon: typeof User2; title: string; status: Status; desc: string;
  cta: string; to: string; disabled?: boolean;
}) {
  const badge = {
    done:    { label: "Done",     cls: "bg-primary/15 text-primary",        I: CheckCircle2 },
    pending: { label: "Pending",  cls: "bg-cream/10 text-cream",            I: Clock },
    rejected:{ label: "Rejected", cls: "bg-destructive/15 text-destructive",I: XCircle },
    todo:    { label: "To do",    cls: "bg-muted text-muted-foreground",    I: Circle },
    locked:  { label: "Locked",   cls: "bg-muted text-muted-foreground",    I: Circle },
  }[status];
  const BadgeIcon = badge.I;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-ember shadow-ember">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badge.cls}`}>
          <BadgeIcon className="h-3.5 w-3.5" />
          {badge.label}
        </span>
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <Button asChild disabled={disabled} variant="outline" size="sm" className="mt-5 w-full border-border/60">
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}
