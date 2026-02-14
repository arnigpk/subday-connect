import { createContext, useContext, useState, ReactNode } from 'react';
import { Lang } from '@/lib/types';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ru',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem('subday_lang') as Lang) || 'ru'
  );

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('subday_lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
