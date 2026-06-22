import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Eye, Loader2, FileText, Filter } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Route as AuthRoute } from "../route";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  head: () => ({ meta: [{ title: "Admin · Payments — Badulla Trip" }] }),
  component: AdminPayments,
});

type SlipRow = {
  id: string;
  student_id: string;
  payment_type: "advance" | "final";
  amount: number;
  slip_url: string;
  status: "pending" | "approved" | "rejected";
  uploaded_at: string;
  profile?: { name: string; email: string; registration_number: string | null; department: string | null } | null;
};

function AdminPayments() {
  const { user } = AuthRoute.useRouteContext();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [previewing, setPreviewing] = useState<SlipRow | null>(null);

  const { data: slips, isLoading } = useQuery({
    queryKey: ["admin-slips", filter],
    queryFn: async () => {
      let q = supabase
        .from("payment_slips")
        .select("id, student_id, payment_type, amount, slip_url, status, uploaded_at, profile:profiles!payment_slips_student_id_fkey(name, email, registration_number, department)")
        .order("uploaded_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data as unknown as SlipRow[];
    },
  });

  const decide = async (slip: SlipRow, decision: "approved" | "rejected") => {
    const { error: e1 } = await supabase
      .from("payment_slips")
      .update({ status: decision, reviewed_at: new Date().toISOString(), reviewed_by: user.id })
      .eq("id", slip.id);
    if (e1) return toast.error(e1.message);

    const col = slip.payment_type === "advance" ? "advance_payment_status" : "final_payment_status";
    const { error: e2 } = await supabase
      .from("profiles")
      .update({ [col]: decision })
      .eq("id", slip.student_id);
    if (e2) return toast.error(e2.message);

    toast.success(`Slip ${decision}`);
    qc.invalidateQueries({ queryKey: ["admin-slips"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</div>
          <h1 className="mt-1 font-display text-4xl font-semibold">Payment review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve or reject uploaded payment slips. Decisions update the student instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card flex items-center gap-2 rounded-2xl p-8 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading slips…
        </div>
      ) : !slips?.length ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
          <FileText className="mx-auto mb-3 h-8 w-8 text-primary" />
          No {filter === "all" ? "" : filter} slips.
        </div>
      ) : (
        <div className="glass-card divide-y divide-border/60 overflow-hidden rounded-2xl">
          {slips.map((s) => (
            <div key={s.id} className="grid items-center gap-4 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:gap-6">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium truncate">{s.profile?.name || s.profile?.email || "Unknown"}</div>
                  <StatusPill status={s.status} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {s.profile?.registration_number || "—"} · {s.profile?.department || "—"} ·{" "}
                  <span className="capitalize">{s.payment_type}</span> · Rs. {Number(s.amount).toLocaleString()} ·{" "}
                  {new Date(s.uploaded_at).toLocaleString()}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPreviewing(s)}>
                <Eye className="mr-1.5 h-4 w-4" /> Preview
              </Button>
              {s.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => decide(s, "approved")}>
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => decide(s, "rejected")}>
                    <XCircle className="mr-1.5 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <SlipPreview slip={previewing} onClose={() => setPreviewing(null)} onDecide={decide} />

      <div className="mt-6">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Back to dashboard</Link>
      </div>
    </main>
  );
}

function SlipPreview({
  slip, onClose, onDecide,
}: { slip: SlipRow | null; onClose: () => void; onDecide: (s: SlipRow, d: "approved" | "rejected") => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slip) { setUrl(null); return; }
    setLoading(true);
    supabase.storage.from("payment-slips").createSignedUrl(slip.slip_url, 60 * 10)
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        setUrl(data?.signedUrl ?? null);
        setLoading(false);
      });
  }, [slip]);

  const isPdf = slip?.slip_url.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={!!slip} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {slip?.profile?.name} — <span className="capitalize">{slip?.payment_type}</span> slip
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto rounded-lg border border-border bg-background/60">
          {loading || !url ? (
            <div className="flex h-80 items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : isPdf ? (
            <iframe src={url} className="h-[70vh] w-full" title="slip" />
          ) : (
            <img src={url} alt="payment slip" className="mx-auto max-h-[70vh] object-contain" />
          )}
        </div>
        {slip?.status === "pending" && (
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="destructive" onClick={() => { onDecide(slip, "rejected"); onClose(); }}>
              <XCircle className="mr-1.5 h-4 w-4" /> Reject
            </Button>
            <Button className="bg-primary text-primary-foreground" onClick={() => { onDecide(slip, "approved"); onClose(); }}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
