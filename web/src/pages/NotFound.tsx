import { Link } from "@tanstack/react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-[var(--font-display)] text-[72px] leading-none tracking-[4px] text-[var(--color-primary)]">404</h1>
      <p className="mt-2 font-[var(--font-heading)] text-lg text-[var(--color-text-primary)]">Page Not Found</p>
      <p className="mt-1 font-[var(--font-body)] text-sm text-[var(--color-text-muted)]">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-[var(--color-primary)] px-6 py-2.5 font-[var(--font-heading)] text-sm font-bold text-white no-underline transition-opacity hover:opacity-90"
      >
        Go Home
      </Link>
    </div>
  );
}
