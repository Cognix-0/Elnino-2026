import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, Building2, Hash, User2, Landmark, FileCheck2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Route as AuthRoute } from "./route";
import { BANK, TRIP } from "@/lib/constants";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/_authenticated/payments")({
  head: () => ({ meta: [{ title: "Payments — Badulla Trip" }] }),
  component: PaymentsPage,
});

type PaymentType = "advance" | "final";

function PaymentsPage() {
  const { user } = AuthRoute.useRouteContext();
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: slips } = useQuery({
    queryKey: ["my-slips", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_slips")
        .select("*")
        .eq("student_id", user.id)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const profileComplete = !!(
    profile?.name && profile?.registration_number && profile?.department &&
    profile?.gender && profile?.phone && profile?.lunch_preference && profile?.dinner_preference
  );

  const advanceApproved = profile?.advance_payment_status === "approved";

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Payments</div>
          <h1 className="mt-1 font-display text-4xl font-semibold">Pay & upload slip</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Transfer to the bank account below, then upload your slip. We'll verify it manually.
          </p>
        </div>

        {!profileComplete && (
          <div className="glass-card mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
            <div className="text-sm">Complete your profile before uploading payment slips.</div>
            <Button asChild size="sm" className="bg-gradient-ember shadow-ember">
              <Link to="/profile">Complete profile</Link>
            </Button>
          </div>
        )}

        <BankCard />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <SlipCard
            type="advance"
            title="Phase 1 — Advance"
            amount={TRIP.advanceAmount}
            description="Rs. 1,000 to confirm your spot and unlock seat booking."
            status={profile?.advance_payment_status ?? "not_uploaded"}
            disabled={!profileComplete}
            latestSlipPath={slips?.find((s) => s.payment_type === "advance")?.slip_url}
            onUploaded={() => qc.invalidateQueries()}
            studentId={user.id}
          />
          <SlipCard
            type="final"
            title="Phase 2 — Final"
            amount={TRIP.finalAmount}
            description="Rs. 2,000 to unlock your ticket. Requires approved advance payment."
            status={profile?.final_payment_status ?? "not_uploaded"}
            disabled={!profileComplete || !advanceApproved}
            disabledReason={!advanceApproved ? "Advance payment must be approved first." : undefined}
            latestSlipPath={slips?.find((s) => s.payment_type === "final")?.slip_url}
            onUploaded={() => qc.invalidateQueries()}
            studentId={user.id}
          />
        </div>

        <SlipHistory slips={slips ?? []} />
      </div>
    </main>
  );
}

function BankCard() {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Landmark className="h-3.5 w-3.5 text-primary" /> Bank deposit
      </div>
      <h2 className="mt-2 font-display text-2xl font-semibold">Transfer details</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <BankRow icon={Building2} label="Bank" value={BANK.bankName} />
        <BankRow icon={Building2} label="Branch" value={BANK.branch} />
        <BankRow icon={Hash} label="Account number" value={BANK.accountNumber} copy />
        <BankRow icon={User2} label="Account holder" value={BANK.accountHolder} />
      </div>
    </div>
  );
}

function BankRow({ icon: Icon, label, value, copy }: {
  icon: typeof Building2; label: string; value: string; copy?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/40 p-4">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 break-all font-medium">{value}</div>
      </div>
      {copy && (
        <button
          onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied"); }}
          className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted/40"
        >
          Copy
        </button>
      )}
    </div>
  );
}

function SlipCard({
  type, title, amount, description, status, disabled, disabledReason, latestSlipPath, onUploaded, studentId,
}: {
  type: PaymentType; title: string; amount: number; description: string;
  status: "not_uploaded" | "pending" | "approved" | "rejected";
  disabled?: boolean; disabledReason?: string;
  latestSlipPath?: string;
  onUploaded: () => void;
  studentId: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    if (!/^(image\/(png|jpe?g|webp)|application\/pdf)$/i.test(file.type))
      return toast.error("PNG, JPG, WEBP or PDF only");

    setUploading(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `${studentId}/${type}-${Date.now()}.${ext}`;
    const up = await supabase.storage.from("payment-slips").upload(path, file, { upsert: false });
    if (up.error) { setUploading(false); return toast.error(up.error.message); }

    const ins = await supabase.from("payment_slips").insert({
      student_id: studentId,
      payment_type: type,
      amount,
      slip_url: path,
      status: "pending",
    });
    if (ins.error) { setUploading(false); return toast.error(ins.error.message); }

    const upd = await supabase.from("profiles").update(
      type === "advance"
        ? { advance_payment_status: "pending" as const }
        : { final_payment_status: "pending" as const }
    ).eq("id", studentId);
    setUploading(false);
    if (upd.error) return toast.error(upd.error.message);

    toast.success("Slip uploaded — awaiting admin review");
    onUploaded();
  };

  return (
    <div className="glass-card flex flex-col rounded-3xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          <div className="mt-1 text-2xl font-semibold text-gradient-sunset">
            Rs. {amount.toLocaleString()}
          </div>
        </div>
        <StatusPill status={status} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {latestSlipPath && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-background/40 px-3 py-2 text-xs text-muted-foreground">
          <FileCheck2 className="h-3.5 w-3.5 text-primary" />
          Last upload: {latestSlipPath.split("/").pop()}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <Button
        onClick={() => fileRef.current?.click()}
        disabled={disabled || uploading || status === "approved"}
        className="mt-5 w-full bg-gradient-ember shadow-ember"
      >
        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        {status === "approved" ? "Approved" : status === "pending" ? "Re-upload slip" : "Upload slip"}
      </Button>
      {disabled && disabledReason && (
        <div className="mt-2 text-center text-xs text-muted-foreground">{disabledReason}</div>
      )}
    </div>
  );
}

function SlipHistory({ slips }: { slips: { id: string; payment_type: string; amount: number; status: string; uploaded_at: string }[] }) {
  if (!slips.length) return null;
  return (
    <div className="mt-10">
      <h3 className="mb-3 font-display text-lg font-semibold">Upload history</h3>
      <div className="glass-card divide-y divide-border/60 overflow-hidden rounded-2xl">
        {slips.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <div className="font-medium capitalize">{s.payment_type} payment</div>
              <div className="text-xs text-muted-foreground">
                {new Date(s.uploaded_at).toLocaleString()} · Rs. {Number(s.amount).toLocaleString()}
              </div>
            </div>
            <StatusPill status={s.status as "pending" | "approved" | "rejected"} />
          </div>
        ))}
      </div>
    </div>
  );
}
