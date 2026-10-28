import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation } from "react-router-dom";
import { AlertMessage } from "@/components/AlertMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth/AuthContext";
import { isMockApiEnabled } from "@/lib/env";
import { loginSchema } from "@/lib/validation";

export function LoginPage() {
  const { user, login, requiresLogin } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (!requiresLogin) {
    return <Navigate to="/" replace />;
  }
  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-sm font-semibold text-sky-700">Trailblazex</p>
          <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isMockApiEnabled()
              ? "Mock sign-in for UI development. No backend token format is used."
              : "Live authentication is waiting on the published API contract."}
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(async (values) => {
              setError(null);
              try {
                await login(values.email, values.password);
              } catch (reason) {
                setError(reason instanceof Error ? reason.message : "Sign-in failed.");
              }
            })}
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="username" {...form.register("email")} />
              {form.formState.errors.email ? (
                <p className="mt-1 text-xs text-red-700">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
              {form.formState.errors.password ? (
                <p className="mt-1 text-xs text-red-700">{form.formState.errors.password.message}</p>
              ) : null}
            </div>
            {error ? <AlertMessage>{error}</AlertMessage> : null}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
            {isMockApiEnabled() ? (
              <p className="text-xs text-slate-500">
                Sample admin: any email except viewer@example.com. Sample viewer: viewer@example.com. Any password.
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
