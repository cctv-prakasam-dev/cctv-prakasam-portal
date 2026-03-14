import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";

import logo from "@/assets/logo.svg";
import { useLogin } from "@/hooks/useAuth";
import { isAuthenticated } from "@/lib/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useLogin();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated()) {
    navigate({ to: "/admin" });
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate({ to: "/admin" });
        },
        onError: (err: unknown) => {
          const apiErr = err as { message?: string };
          setError(apiErr.message || "Invalid credentials. Please try again.");
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-1)] px-4">
      <div className="w-full max-w-[400px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-8 text-center">
          <img src={logo} alt="CCTV AP Prakasam" className="mx-auto mb-4 h-12 object-contain" />
          <h1 className="font-[var(--font-display)] text-xl tracking-[2px] text-[var(--color-text-primary)]">
            ADMIN LOGIN
          </h1>
          <p className="mt-1 font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
            Sign in to access the dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-2">
            <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
              placeholder="••••••••"
            />
          </div>

          <div className="mb-5 text-right">
            <Link
              to="/forgot-password"
              className="font-[var(--font-body)] text-xs text-[var(--color-primary)] no-underline hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full cursor-pointer rounded-lg bg-[var(--color-primary)] py-3 font-[var(--font-heading)] text-sm font-bold uppercase tracking-[1px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {login.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-5 text-center font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
          Don't have an account?
          {" "}
          <Link to="/register" className="font-medium text-[var(--color-primary)] no-underline hover:underline">
            Register
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Link
            to="/"
            className="font-[var(--font-body)] text-xs text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary)]"
          >
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
