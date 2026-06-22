import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Route as AuthRoute } from "./route";
import { DEPARTMENTS, GENDERS, LUNCH, DINNER } from "@/lib/constants";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Your profile — Badulla Trip" }] }),
  component: ProfilePage,
});

type ProfileForm = {
  name: string;
  registration_number: string;
  department: string;
  gender: string;
  phone: string;
  lunch_preference: string;
  dinner_preference: string;
};

const empty: ProfileForm = {
  name: "", registration_number: "", department: "", gender: "",
  phone: "", lunch_preference: "", dinner_preference: "",
};

function ProfilePage() {
  const { user } = AuthRoute.useRouteContext();
  const qc = useQueryClient();
  const [form, setForm] = useState<ProfileForm>(empty);
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name ?? "",
      registration_number: profile.registration_number ?? "",
      department: profile.department ?? "",
      gender: profile.gender ?? "",
      phone: profile.phone ?? "",
      lunch_preference: profile.lunch_preference ?? "",
      dinner_preference: profile.dinner_preference ?? "",
    });
  }, [profile]);

  const update = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.name.length > 120) return toast.error("Enter your name");
    if (!form.registration_number.trim() || form.registration_number.length > 40)
      return toast.error("Enter your registration number");
    if (!/^[0-9+\-\s]{7,20}$/.test(form.phone)) return toast.error("Enter a valid phone number");
    if (!form.department || !form.gender || !form.lunch_preference || !form.dinner_preference)
      return toast.error("Please complete all fields");

    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      name: form.name.trim(),
      registration_number: form.registration_number.trim(),
      department: form.department as "Computer Engineering",
      gender: form.gender as "Male",
      phone: form.phone.trim(),
      lunch_preference: form.lunch_preference as "Chicken",
      dinner_preference: form.dinner_preference as "Rice",
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile", user.id] });
  };

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account</div>
          <h1 className="mt-1 font-display text-4xl font-semibold">Your profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in your trip details. You can update these any time before payment is approved.
          </p>
        </div>

        {isLoading ? (
          <div className="glass-card flex items-center gap-2 rounded-2xl p-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <form onSubmit={onSubmit} className="glass-card grid gap-5 rounded-3xl p-8 sm:grid-cols-2">
            <Text label="Full name" v={form.name} on={(v) => update("name", v)} />
            <Text label="Registration number" v={form.registration_number} on={(v) => update("registration_number", v)} />

            <Pick label="Department" v={form.department} on={(v) => update("department", v)} options={DEPARTMENTS as readonly string[]} />
            <Pick label="Gender" v={form.gender} on={(v) => update("gender", v)} options={GENDERS as readonly string[]} />

            <Text label="Phone" v={form.phone} on={(v) => update("phone", v)} type="tel" />
            <div className="sm:col-span-1">
              <Label>Email</Label>
              <Input value={user.email ?? ""} disabled className="mt-1.5" />
            </div>

            <Pick label="Lunch preference" v={form.lunch_preference} on={(v) => update("lunch_preference", v)} options={LUNCH as readonly string[]} />
            <Pick label="Dinner preference" v={form.dinner_preference} on={(v) => update("dinner_preference", v)} options={DINNER as readonly string[]} />

            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving} className="w-full bg-gradient-ember shadow-ember">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save profile
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

function Text({ label, v, on, type = "text" }: { label: string; v: string; on: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type={type} value={v} onChange={(e) => on(e.target.value)} className="mt-1.5" />
    </div>
  );
}

function Pick({ label, v, on, options }: { label: string; v: string; on: (v: string) => void; options: readonly string[] }) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={v} onValueChange={on}>
        <SelectTrigger className="mt-1.5"><SelectValue placeholder={`Select ${label.toLowerCase()}`} /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
