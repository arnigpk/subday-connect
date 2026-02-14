import { useState } from 'react';
import { FaqData, FaqItem } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

interface Props {
  data: FaqData;
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors"
          >
            <span className="font-medium text-sm pr-4">{item.question}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                openIndex === i ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function FaqSection({ data }: Props) {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<'users' | 'partners'>('users');

  return (
    <section id="faq" className="section-padding section-alt">
      <div className="container mx-auto max-w-2xl">
        <h2 className="heading-lg text-center mb-10">{data.title}</h2>

        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === 'users' ? 'bg-foreground text-background' : 'bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            {lang === 'ru' ? 'Пользователям' : 'Пайдаланушыларға'}
          </button>
          <button
            onClick={() => setTab('partners')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === 'partners' ? 'bg-foreground text-background' : 'bg-accent text-muted-foreground hover:text-foreground'
            }`}
          >
            {lang === 'ru' ? 'Партнёрам' : 'Серіктестерге'}
          </button>
        </div>

        <FaqAccordion items={tab === 'users' ? data.user_items : data.partner_items} />
      </div>
    </section>
  );
}
