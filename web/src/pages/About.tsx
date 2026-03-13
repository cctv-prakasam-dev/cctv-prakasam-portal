import ceoPhoto from "@/assets/ceo-photo.svg";

const stats = [
  { label: "Subscribers", value: "50K+", color: "var(--color-primary)" },
  { label: "Videos", value: "1,200+", color: "#DB2777" },
  { label: "Monthly Views", value: "500K+", color: "#D97706" },
  { label: "Years", value: "5+", color: "#6D28D9" },
];

const cards = [
  {
    title: "OUR MISSION",
    icon: "🎯",
    text: "Deliver accurate, timely news to Prakasam district, empowering communities through informed journalism.",
    color: "var(--color-primary)",
  },
  {
    title: "OUR VISION",
    icon: "🔭",
    text: "Become South India's most trusted digital news platform, setting new standards for regional journalism.",
    color: "#DB2777",
  },
];

export default function About() {
  return (
    <div>
      {/* Header */}
      <div className="bg-[var(--color-primary-bg)] px-6 pt-12 pb-8 text-center dark:bg-[var(--color-surface-1)]">
        <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[var(--color-primary)]">About Us</span>
        <h1 className="mt-1.5 mb-2.5 font-[var(--font-display)] text-[42px] tracking-[3px] text-[var(--color-text-primary)]">CCTV PRAKASAM</h1>
        <p className="mx-auto max-w-[540px] font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Prakasam district's most trusted digital news channel since 2021.
        </p>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-[var(--max-content)] px-6 pb-10">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(145px,1fr))] gap-3">
          {stats.map(s => (
            <div
              key={s.label}
              className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center shadow-sm"
              style={{ borderTopWidth: 3, borderTopColor: s.color }}
            >
              <div className="font-[var(--font-display)] text-[32px]" style={{ color: s.color }}>{s.value}</div>
              <div className="mt-1 font-[var(--font-body)] text-[11px] text-[var(--color-text-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CEO Section */}
      <section className="bg-[var(--color-surface-1)] px-6 pt-10 pb-14">
        <div className="mx-auto max-w-[var(--max-content)]">
          <div className="grid grid-cols-1 items-center gap-10 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-card)] p-10 shadow-md min-[900px]:grid-cols-2">
            <div className="mx-auto max-w-[280px]">
              <div className="aspect-[3/4] overflow-hidden rounded-[14px] bg-cyan-50 dark:bg-slate-800">
                <img src={ceoPhoto} alt="Founder & CEO" className="h-full w-full object-cover object-top" />
              </div>
            </div>
            <div>
              <span className="font-[var(--font-heading)] text-[11px] font-bold uppercase tracking-[2px] text-[#DB2777]">Founder & CEO</span>
              <h2 className="mt-1.5 mb-4 font-[var(--font-display)] text-[30px] tracking-[2px] text-[var(--color-text-primary)]">OUR VISIONARY LEADER</h2>
              <p className="font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">
                With a passion for truth, our founder established CCTV Prakasam to deliver authentic local news. What started small has grown into Prakasam's go-to news source.
              </p>
              <p className="mt-2 font-[var(--font-body)] text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                Dedication to unbiased reporting has earned the trust of thousands across Andhra Pradesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[var(--color-background)] px-6 pt-11 pb-14">
        <div className="mx-auto grid max-w-[var(--max-content)] grid-cols-1 gap-4.5 min-[900px]:grid-cols-2">
          {cards.map(m => (
            <div
              key={m.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm"
              style={{ borderTopWidth: 3, borderTopColor: m.color }}
            >
              <div className="mb-2.5 text-[34px]">{m.icon}</div>
              <h3 className="mb-2.5 font-[var(--font-display)] text-lg tracking-[2px]" style={{ color: m.color }}>{m.title}</h3>
              <p className="font-[var(--font-body)] text-sm leading-relaxed text-[var(--color-text-secondary)]">{m.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
