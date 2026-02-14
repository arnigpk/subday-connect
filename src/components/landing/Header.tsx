import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import logoSubday from '@/assets/logo-subday.png';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#how-it-works', ru: 'Как работает', kz: 'Қалай жұмыс істейді' },
  { href: '#for-users', ru: 'Пользователям', kz: 'Пайдаланушыларға' },
  { href: '#for-partners', ru: 'Партнёрам', kz: 'Серіктестерге' },
  { href: '#trust', ru: 'Доверие', kz: 'Сенім' },
  { href: '#faq', ru: 'FAQ', kz: 'FAQ' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <img src={logoSubday} alt="subday" className="h-8" />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {lang === 'ru' ? link.ru : link.kz}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ru' ? 'kz' : 'ru')}
            className="text-xs font-semibold uppercase px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
          >
            {lang === 'ru' ? 'KZ' : 'RU'}
          </button>

          <button
            className="md:hidden p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="md:hidden bg-background border-b border-border pb-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-6 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {lang === 'ru' ? link.ru : link.kz}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
