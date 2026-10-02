import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGS, LESSON_TR, T, UNIT_TR } from '../i18n/strings.js';
import { readStore, writeStore } from '../lib/storage.js';

const LanguageContext = createContext(null);
const CODES = LANGS.map(l => l[0]);

/* Holds the site language and the language of the "Explained simply" tabs.
   Picking a site language also moves the explanation tabs to it. */
export function LanguageProvider({ children, initialLang }) {
  const [lang, setLangState] = useState(() => {
    const saved = initialLang ?? readStore('blocklab-lang', 'en');
    return CODES.includes(saved) ? saved : 'en';
  });
  const [explainLang, setExplainState] = useState(() => {
    const saved = initialLang ?? readStore('blocklab-explain-lang', lang);
    return CODES.includes(saved) ? saved : lang;
  });

  const setLang = useCallback(code => {
    setLangState(code);
    setExplainState(code);
    writeStore('blocklab-lang', code);
    writeStore('blocklab-explain-lang', code);
  }, []);

  const setExplainLang = useCallback(code => {
    setExplainState(code);
    writeStore('blocklab-explain-lang', code);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const t = key => T[lang][key] ?? T.en[key];
    return {
      lang,
      setLang,
      explainLang,
      setExplainLang,
      t,
      /** A lesson field (title, hook, toyTitle, goal) in the current language. */
      lt: (lesson, field) => LESSON_TR[lang]?.[lesson.id]?.[field] ?? lesson[field],
      unitTitle: unit => UNIT_TR[lang]?.[unit.n]?.[0] ?? unit.title,
      unitBlurb: unit => UNIT_TR[lang]?.[unit.n]?.[1] ?? unit.blurb
    };
  }, [lang, explainLang, setLang, setExplainLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}
