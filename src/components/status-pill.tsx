import { CheckCircle2, Clock, XCircle, Circle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Status = "not_uploaded" | "pending" | "approved" | "rejected";

const map: Record<Status, { label: string; cls: string; Icon: LucideIcon }> = {
  approved:     { label: "Approved",     cls: "bg-primary/15 text-primary",         Icon: CheckCircle2 },
  pending:      { label: "Under review", cls: "bg-cream/10 text-cream",             Icon: Clock },
  rejected:     { label: "Rejected",     cls: "bg-destructive/15 text-destructive", Icon: XCircle },
  not_uploaded: { label: "Not uploaded", cls: "bg-muted text-muted-foreground",     Icon: Circle },
};

export function StatusPill({ status }: { status: Status }) {
  const m = map[status];
  const Icon = m.Icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${m.cls}`}>
      <Icon className="h-3.5 w-3.5" /> {m.label}
    </span>
  );
}
