import { useLanguageStore, useT } from '../../store/useLanguageStore';
import { availableLanguages, languageNames } from '../../i18n';
import type { Language } from '../../i18n';

export const LanguageSelector: React.FC = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = useT();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{t.settings.language}:</span>
      <div className="flex gap-1">
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang as Language)}
            className={`
              px-2 py-0.5 text-xs rounded transition-colors
              ${language === lang
                ? 'bg-violet-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
            `}
          >
            {languageNames[lang as Language]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
