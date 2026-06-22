import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bus, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Badulla Trip" },
      { name: "description", content: "Sign in or create an account to register for the Badulla batch trip." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/dashboard", replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Check your email if confirmation is required.");
    navigate({ to: "/profile", replace: true });
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      setLoading(false);
      toast.error(result.error.message || "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-ember">
            <Bus className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          Badulla Trip
        </Link>
      </div>

      <div className="mx-auto flex max-w-md flex-col px-6 pb-20">
        <div className="glass-card rounded-3xl p-8">
          <h1 className="font-display text-3xl font-semibold">Welcome aboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in with your university email to continue.
          </p>

          <Tabs defaultValue="signin" className="mt-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <Field label="Email" id="si-email" type="email" value={email} onChange={setEmail} />
                <Field label="Password" id="si-pw" type="password" value={password} onChange={setPassword} />
                <Button type="submit" disabled={loading} className="w-full bg-gradient-ember shadow-ember">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <Field label="Full name" id="su-name" value={name} onChange={setName} />
                <Field label="Email" id="su-email" type="email" value={email} onChange={setEmail} />
                <Field label="Password" id="su-pw" type="password" value={password} onChange={setPassword} />
                <Button type="submit" disabled={loading} className="w-full bg-gradient-ember shadow-ember">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            variant="outline"
            className="w-full border-border/60"
          >
            <GoogleIcon /> Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, id, type = "text", value, onChange,
}: { label: string; id: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 10.2v3.96h5.49c-.24 1.42-1.62 4.18-5.49 4.18-3.3 0-6-2.73-6-6.1s2.7-6.1 6-6.1c1.88 0 3.13.78 3.85 1.46l2.62-2.52C16.9 3.6 14.6 2.7 12 2.7 6.95 2.7 2.86 6.78 2.86 11.84S6.95 20.98 12 20.98c6.93 0 9.15-4.85 9.15-7.34 0-.5-.05-.88-.12-1.44H12z"/>
    </svg>
  );
}
