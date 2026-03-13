import { useState } from "react";
import { Mail, MapPin, Phone, Youtube } from "lucide-react";

import { apiPost } from "@/lib/apiClient";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+91 98765 43210", color: "var(--color-primary)" },
  { icon: Mail, label: "Email", value: "contact@cctvprakasam.com", color: "#DB2777" },
  { icon: MapPin, label: "Office", value: "Ongole, Prakasam Dist., AP", color: "#D97706" },
  { icon: Youtube, label: "YouTube", value: "CCTV Prakasam", color: "#DC2626" },
];

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      await apiPost("/contact", {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        subject: form.subject,
        message: form.message,
      });
      setStatus("success");
      setForm(initialForm);
    }
    catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-[var(--color-primary-bg)] px-6 pt-12 pb-8 text-center dark:bg-[var(--color-surface-1)]">
        <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-primary)]">Get In Touch</span>
        <h1 className="mt-1.5 mb-2.5 font-[var(--font-display)] text-[42px] tracking-[3px] text-[var(--color-text-primary)]">CONTACT US</h1>
        <p className="mx-auto max-w-[540px] font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Have a news tip, feedback, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-[var(--max-content)] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 min-[900px]:grid-cols-[1fr_340px]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm"
          >
            <h2 className="mb-6 font-[var(--font-display)] text-xl tracking-[2px] text-[var(--color-text-primary)]">SEND A MESSAGE</h2>

            <div className="grid grid-cols-1 gap-4 min-[600px]:grid-cols-2">
              <div>
                <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                  Name
                  {" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                  Email
                  {" "}
                  <span className="text-red-500">*</span>
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
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 min-[600px]:grid-cols-2">
              <div>
                <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={20}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                  Subject
                  {" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
                  placeholder="What's this about?"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block font-[var(--font-body)] text-[13px] font-medium text-[var(--color-text-secondary)]">
                Message
                {" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                maxLength={2000}
                rows={5}
                className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 font-[var(--font-body)] text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-primary)]"
                placeholder="Your message..."
              />
            </div>

            {status === "success" && (
              <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                Message sent successfully! We&apos;ll get back to you soon.
              </div>
            )}

            {status === "error" && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 rounded-lg bg-[var(--color-primary)] px-8 py-3 font-[var(--font-heading)] text-sm font-bold uppercase tracking-[1px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Contact Info Sidebar */}
          <div className="flex flex-col gap-4">
            {contactInfo.map(c => (
              <div
                key={c.label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm"
                style={{ borderLeftWidth: 3, borderLeftColor: c.color }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${c.color}15`, color: c.color }}
                  >
                    <c.icon size={18} />
                  </div>
                  <div>
                    <div className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[1px] text-[var(--color-text-muted)]">{c.label}</div>
                    <div className="font-[var(--font-body)] text-sm text-[var(--color-text-primary)]">{c.value}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Map Placeholder */}
            <div className="flex h-[200px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-1)]">
              <div className="text-center">
                <MapPin size={28} className="mx-auto mb-2 text-[var(--color-text-muted)]" />
                <span className="font-[var(--font-body)] text-xs text-[var(--color-text-muted)]">Google Maps</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
