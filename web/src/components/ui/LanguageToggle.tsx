import { useLanguage } from "@/stores/languageStore";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/12 bg-white/8 font-[var(--font-heading)] text-[11px] font-bold text-white transition-all hover:bg-white/15"
      title={language === "en" ? "Switch to Telugu" : "Switch to English"}
    >
      {language === "en" ? "తె" : "EN"}
    </button>
  );
}
