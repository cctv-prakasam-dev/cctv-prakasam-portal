import { Link } from "@tanstack/react-router";

export default function Cookies() {
  return (
    <div className="mx-auto max-w-[var(--max-content)] px-6 pt-12 pb-16">
      <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-primary)]">Legal</span>
      <h1 className="mt-1.5 mb-6 font-[var(--font-display)] text-[36px] tracking-[3px] text-[var(--color-text-primary)]">COOKIE POLICY</h1>

      <div className="space-y-8 font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <p>
          <strong className="text-[var(--color-text-primary)]">Last updated:</strong>
          {" "}
          March 2026
        </p>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">WHAT ARE COOKIES?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">COOKIES WE USE</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[var(--color-surface-1)]">
                  <th className="px-4 py-3 font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">Cookie</th>
                  <th className="px-4 py-3 font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">Purpose</th>
                  <th className="px-4 py-3 font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                <tr>
                  <td className="px-4 py-3 font-[var(--font-mono)] text-xs text-[var(--color-primary)]">access_token</td>
                  <td className="px-4 py-3">Authentication — keeps you logged in securely (httpOnly).</td>
                  <td className="px-4 py-3">30 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-[var(--font-mono)] text-xs text-[var(--color-primary)]">refresh_token</td>
                  <td className="px-4 py-3">Authentication — renews your session automatically (httpOnly).</td>
                  <td className="px-4 py-3">90 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">LOCAL STORAGE</h2>
          <p>We also use browser local storage (not cookies) for:</p>
          <div className="mt-3 overflow-hidden rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[var(--color-surface-1)]">
                  <th className="px-4 py-3 font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">Key</th>
                  <th className="px-4 py-3 font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                <tr>
                  <td className="px-4 py-3 font-[var(--font-mono)] text-xs text-[var(--color-primary)]">cctv-prakasam-theme</td>
                  <td className="px-4 py-3">Remembers your dark/light theme preference.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-[var(--font-mono)] text-xs text-[var(--color-primary)]">cctv-prakasam-user</td>
                  <td className="px-4 py-3">Stores your account display information for the session.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">THIRD-PARTY COOKIES</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              <strong>YouTube embeds:</strong>
              {" "}
              When you play a video, YouTube may set its own cookies. See
              {" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[var(--color-primary)] underline">Google's Cookie Policy</a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">MANAGING COOKIES</h2>
          <p>
            You can control cookies through your browser settings. Disabling authentication cookies will require you to log in each time you visit. Clearing local storage will reset your theme preference.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">CONTACT</h2>
          <p>
            Questions about our cookie usage? Please
            {" "}
            <Link to="/contact" className="text-[var(--color-primary)] underline">contact us</Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
