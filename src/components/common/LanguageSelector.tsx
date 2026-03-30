"use client";

import { Language } from "@/lib/i18n";
import { useLanguage } from "@/components/providers/LanguageProvider";

const LANGUAGES = [
  { code: Language.DE, label: "DE" },
  { code: Language.EN, label: "EN" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex rounded overflow-hidden border border-habbo-border">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            px-2.5 py-1 text-[10px] font-mono font-bold transition-colors
            ${
              language === lang.code
                ? "bg-habbo-gold/20 text-habbo-gold"
                : "bg-habbo-card text-habbo-text-dim hover:text-habbo-text"
            }
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
