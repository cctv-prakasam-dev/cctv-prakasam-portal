import { useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle } from "lucide-react";

import logo from "@/assets/logo.svg";
import PasswordInput from "@/components/ui/PasswordInput";
import { useResetPassword } from "@/hooks/useAuth";

export default function ResetPassword() {
  const search = useSearch({ strict: false }) as { token?: string };
  const token = search.token || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const resetPassword = useResetPassword();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    resetPassword.mutate(
      { token, password, confirm_password: confirmPassword },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (err: unknown) => {
          const apiErr = err as { message?: string };
          setError(apiErr.message || "Reset failed. The link may have expired.");
        },
      },
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-1)] px-4">
        <div className="w-full max-w-[400px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center shadow-lg">
          <h1 className="mb-3 font-[var(--font-display)] text-xl tracking-[2px] text-[var(--color-text-primary)]">
            INVALID LINK
          </h1>
          <p className="mb-6 font-[var(--font-body)] text-sm text-[var(--color-text-secondary)]">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="font-[var(--font-heading)] text-sm font-medium text-[var(--color-primary)] no-underline hover:underline"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-1)] px-4">
      <div className="w-full max-w-[400px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-6 text-center">
          <img src={logo} alt="CCTV AP Prakasam" className="mx-auto mb-3 h-12 object-contain" />
          <h1 className="font-[var(--font-display)] text-xl tracking-[2px] text-[var(--color-text-primary)]">
            RESET PASSWORD
          </h1>
          <p className="mt-1 font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
            Enter your new password below
          </p>
        </div>

        {success
          ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                  <CheckCircle size={28} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="mb-2 font-[var(--font-heading)] text-base font-bold text-[var(--color-text-primary)]">
                  Password Updated
                </h2>
                <p className="mb-6 font-[var(--font-body)] text-sm text-[var(--color-text-secondary)]">
                  Your password has been reset successfully. You can now sign in.
                </p>
                <Link
                  to="/admin/login"
                  className="inline-block rounded-lg bg-[var(--color-primary)] px-6 py-2.5 font-[var(--font-heading)] text-sm font-bold text-white no-underline transition-opacity hover:opacity-90"
                >
                  Go to Login
                </Link>
              </div>
            )
          : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                    New Password
                  </label>
                  <PasswordInput
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Min 8 characters"
                  />
                </div>

                <div className="mb-5">
                  <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                    Confirm Password
                  </label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    name="confirm_password"
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                  />
                </div>

                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetPassword.isPending}
                  className="w-full cursor-pointer rounded-lg bg-[var(--color-primary)] py-3 font-[var(--font-heading)] text-sm font-bold uppercase tracking-[1px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {resetPassword.isPending ? "Resetting..." : "Reset Password"}
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
