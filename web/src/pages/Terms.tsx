import { Link } from "@tanstack/react-router";

export default function Terms() {
  return (
    <div className="mx-auto max-w-[var(--max-content)] px-6 pt-12 pb-16">
      <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-primary)]">Legal</span>
      <h1 className="mt-1.5 mb-6 font-[var(--font-display)] text-[36px] tracking-[3px] text-[var(--color-text-primary)]">TERMS OF SERVICE</h1>

      <div className="space-y-8 font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <p>
          <strong className="text-[var(--color-text-primary)]">Last updated:</strong>
          {" "}
          March 2026
        </p>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">1. ACCEPTANCE OF TERMS</h2>
          <p>
            By accessing and using the CCTV AP Prakasam portal, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of this website.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">2. USE OF SERVICE</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>This portal provides digital news content from Prakasam district, Andhra Pradesh.</li>
            <li>Video content is sourced from our official YouTube channel (@CctvPrakasam).</li>
            <li>You may browse content freely without registration.</li>
            <li>Account registration is required for newsletter subscriptions and admin features.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">3. USER ACCOUNTS</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>You must provide accurate information during registration.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">4. CONTENT & COPYRIGHT</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>All news content, videos, and articles are the property of CCTV AP Prakasam.</li>
            <li>You may share content via the provided share buttons for personal, non-commercial use.</li>
            <li>Republishing or redistributing content without permission is prohibited.</li>
            <li>YouTube video content is subject to YouTube's Terms of Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">5. DISCLAIMER</h2>
          <p>
            News content is provided "as is" and we strive for accuracy. However, we do not guarantee that all information is error-free. We are not liable for any actions taken based on the content provided on this portal.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">6. CHANGES TO TERMS</h2>
          <p>
            We may update these terms from time to time. Continued use of the portal after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">7. CONTACT</h2>
          <p>
            For questions about these terms, please
            {" "}
            <Link to="/contact" className="text-[var(--color-primary)] underline">contact us</Link>
            {" "}
            or email
            {" "}
            <a href="mailto:cctvprakasam@gmail.com" className="text-[var(--color-primary)] underline">cctvprakasam@gmail.com</a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
