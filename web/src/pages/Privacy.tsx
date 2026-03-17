import { Link } from "@tanstack/react-router";

export default function Privacy() {
  return (
    <div className="mx-auto max-w-[var(--max-content)] px-6 pt-12 pb-16">
      <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-primary)]">Legal</span>
      <h1 className="mt-1.5 mb-6 font-[var(--font-display)] text-[36px] tracking-[3px] text-[var(--color-text-primary)]">PRIVACY POLICY</h1>

      <div className="space-y-8 font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <p>
          <strong className="text-[var(--color-text-primary)]">Last updated:</strong>
          {" "}
          March 2026
        </p>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">1. INFORMATION WE COLLECT</h2>
          <p>When you use CCTV AP Prakasam portal, we may collect:</p>
          <ul className="mt-2 ml-5 list-disc space-y-1">
            <li>
              <strong>Account information:</strong>
              {" "}
              Name, email, phone number when you register.
            </li>
            <li>
              <strong>Contact form data:</strong>
              {" "}
              Name, email, phone, and message when you reach out via the contact form.
            </li>
            <li>
              <strong>Newsletter subscription:</strong>
              {" "}
              Email address when you subscribe.
            </li>
            <li>
              <strong>Usage data:</strong>
              {" "}
              Pages visited, time spent, and interactions collected via analytics.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">2. HOW WE USE YOUR INFORMATION</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>To provide and maintain our news portal services.</li>
            <li>To send newsletters and updates you have opted into.</li>
            <li>To respond to your inquiries submitted through the contact form.</li>
            <li>To improve our website experience and content quality.</li>
            <li>To manage user accounts and authentication.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">3. THIRD-PARTY SERVICES</h2>
          <p>We use the following third-party services:</p>
          <ul className="mt-2 ml-5 list-disc space-y-1">
            <li>
              <strong>YouTube Data API:</strong>
              {" "}
              To fetch and display video content. Subject to
              {" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[var(--color-primary)] underline">Google Privacy Policy</a>
              .
            </li>
            <li>
              <strong>Brevo (Sendinblue):</strong>
              {" "}
              For transactional emails (verification, password reset, newsletters).
            </li>
            <li>
              <strong>Cloudflare R2:</strong>
              {" "}
              For file storage.
            </li>
            <li>
              <strong>OpenStreetMap:</strong>
              {" "}
              For displaying our office location on the contact page.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">4. DATA SECURITY</h2>
          <p>
            We implement industry-standard security measures including encrypted passwords (bcrypt hashing), secure HTTP-only cookies for authentication, and SSL/TLS encryption for all data in transit. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">5. YOUR RIGHTS</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Request access to your personal data.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Unsubscribe from newsletters at any time.</li>
            <li>Request account deletion by contacting us.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-[var(--font-display)] text-lg tracking-[1px] text-[var(--color-text-primary)]">6. CONTACT US</h2>
          <p>
            For privacy-related inquiries, please
            {" "}
            <Link to="/contact" className="text-[var(--color-primary)] underline">contact us</Link>
            {" "}
            or email us at
            {" "}
            <a href="mailto:cctvprakasam@gmail.com" className="text-[var(--color-primary)] underline">cctvprakasam@gmail.com</a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
