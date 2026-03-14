import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";

import logo from "@/assets/logo.svg";
import { useForgotPassword } from "@/hooks/useAuth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const forgotPassword = useForgotPassword();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    forgotPassword.mutate(
      { email },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (err: unknown) => {
          const apiErr = err as { message?: string };
          setError(apiErr.message || "Something went wrong. Please try again.");
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-1)] px-4">
      <div className="w-full max-w-[400px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-6 text-center">
          <img src={logo} alt="CCTV AP Prakasam" className="mx-auto mb-3 h-12 object-contain" />
          <h1 className="font-[var(--font-display)] text-xl tracking-[2px] text-[var(--color-text-primary)]">
            FORGOT PASSWORD
          </h1>
          <p className="mt-1 font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
            Enter your email to receive a password reset link
          </p>
        </div>

        {success
          ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                  <Mail size={28} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="mb-2 font-[var(--font-heading)] text-base font-bold text-[var(--color-text-primary)]">
                  Check Your Email
                </h2>
                <p className="mb-6 font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  We've sent a password reset link to
                  {" "}
                  <strong>{email}</strong>
                  . Please check your inbox and follow the instructions.
                </p>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-2 font-[var(--font-heading)] text-sm font-medium text-[var(--color-primary)] no-underline hover:underline"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            )
          : (
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
                    placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={forgotPassword.isPending}
                  className="w-full cursor-pointer rounded-lg bg-[var(--color-primary)] py-3 font-[var(--font-heading)] text-sm font-bold uppercase tracking-[1px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {forgotPassword.isPending ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

        <div className="mt-5 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 font-[var(--font-body)] text-xs text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary)]"
          >
            <ArrowLeft size={12} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
