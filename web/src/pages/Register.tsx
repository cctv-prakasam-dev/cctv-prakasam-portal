import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";

import logo from "@/assets/logo.svg";
import { useRegister } from "@/hooks/useAuth";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const register = useRegister();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    register.mutate(
      {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(navigate, 2000, { to: "/admin/login" });
        },
        onError: (err: unknown) => {
          const apiErr = err as { message?: string };
          setError(apiErr.message || "Registration failed. Please try again.");
        },
      },
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-1)] px-4 py-10">
      <div className="w-full max-w-[440px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-lg">
        {/* Logo */}
        <div className="mb-6 text-center">
          <img src={logo} alt="CCTV AP Prakasam" className="mx-auto mb-3 h-12 object-contain" />
          <h1 className="font-[var(--font-display)] text-xl tracking-[2px] text-[var(--color-text-primary)]">
            CREATE ACCOUNT
          </h1>
          <p className="mt-1 font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">
            Join the CCTV AP Prakasam community
          </p>
        </div>

        {success && (
          <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
            Registration successful! Redirecting to login...
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
              placeholder="you@example.com"
            />
          </div>

          <div className="mt-3">
            <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 pr-10 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-none bg-transparent text-[var(--color-text-muted)]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
              placeholder="Re-enter password"
            />
          </div>

          {error && (
            <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={register.isPending || success}
            className="mt-5 w-full cursor-pointer rounded-lg bg-[var(--color-primary)] py-3 font-[var(--font-heading)] text-sm font-bold uppercase tracking-[1px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {register.isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-5 text-center font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
          Already have an account?
          {" "}
          <Link to="/admin/login" className="font-medium text-[var(--color-primary)] no-underline hover:underline">
            Sign In
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Link to="/" className="font-[var(--font-body)] text-xs text-[var(--color-text-muted)] no-underline hover:text-[var(--color-primary)]">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
