import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/status-pill";

export const Route = createFileRoute("/_authenticated/admin/students")({
  head: () => ({ meta: [{ title: "Admin · Students — Badulla Trip" }] }),
  component: AdminStudents,
});

type Row = {
  id: string;
  name: string | null;
  email: string;
  registration_number: string | null;
  department: string | null;
  phone: string | null;
  lunch_preference: string | null;
  dinner_preference: string | null;
  advance_payment_status: "pending" | "approved" | "rejected" | null;
  final_payment_status: "pending" | "approved" | "rejected" | null;
  bus_id?: number | null;
  seat_number?: number | null;
};

function AdminStudents() {
  const [q, setQ] = useState("");

  const { data: rows, isLoading } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const [{ data: profiles, error: pe }, { data: bookings, error: be }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("seat_bookings").select("student_id, bus_id, seat_number"),
      ]);
      if (pe) throw pe;
      if (be) throw be;
      const byStudent = new Map((bookings ?? []).map((b) => [b.student_id, b]));
      return (profiles ?? []).map((p) => ({
        ...p,
        bus_id: byStudent.get(p.id)?.bus_id ?? null,
        seat_number: byStudent.get(p.id)?.seat_number ?? null,
      })) as Row[];
    },
  });

  const filtered = useMemo(() => {
    if (!rows) return [];
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.registration_number, r.department, r.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [rows, q]);

  function exportCsv() {
    if (!filtered.length) return;
    const headers = [
      "Name","Email","Reg No","Department","Phone","Lunch","Dinner",
      "Advance","Final","Bus","Seat",
    ];
    const lines = filtered.map((r) => [
      r.name, r.email, r.registration_number, r.department, r.phone,
      r.lunch_preference, r.dinner_preference,
      r.advance_payment_status, r.final_payment_status,
      r.bus_id, r.seat_number,
    ].map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "students.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin</div>
          <h1 className="mt-1 font-display text-4xl font-semibold">Students</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows?.length ?? 0} registered · {filtered.length} shown
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, reg no, email…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-[260px] pl-9"
            />
          </div>
          <Button onClick={exportCsv} variant="outline" size="sm">
            <Download className="mr-1.5 h-4 w-4" /> CSV
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <Th>Student</Th>
                <Th>Reg No</Th>
                <Th>Department</Th>
                <Th>Advance</Th>
                <Th>Final</Th>
                <Th>Seat</Th>
                <Th>Meals</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
              ) : !filtered.length ? (
                <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No students.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20">
                  <Td>
                    <div className="font-medium">{r.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                  </Td>
                  <Td className="font-mono text-xs">{r.registration_number || "—"}</Td>
                  <Td>{r.department || "—"}</Td>
                  <Td><StatusPill status={r.advance_payment_status ?? "pending"} /></Td>
                  <Td><StatusPill status={r.final_payment_status ?? "pending"} /></Td>
                  <Td>
                    {r.bus_id
                      ? <span className="font-medium">Bus {r.bus_id} · #{r.seat_number}</span>
                      : <span className="text-xs text-muted-foreground">—</span>}
                  </Td>
                  <Td className="text-xs text-muted-foreground">
                    {(r.lunch_preference || "—")} / {(r.dinner_preference || "—")}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">← Admin overview</Link>
      </div>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
