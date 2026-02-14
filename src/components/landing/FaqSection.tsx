import { useState } from 'react';
import { FaqData, FaqItem } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp } from '@/lib/animations';

interface Props {
  data: FaqData;
}

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="border border-border rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/50 transition-colors"
          >
            <span className="font-medium text-sm pr-4">{item.question}</span>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown size={18} className="shrink-0 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export function FaqSection({ data }: Props) {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<'users' | 'partners'>('users');

  return (
    <section id="faq" className="section-padding section-alt overflow-hidden">
      <div className="container mx-auto max-w-2xl">
        <motion.h2
          className="heading-lg text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          {data.title}
        </motion.h2>

        <motion.div
          className="flex justify-center gap-2 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <FaqAccordion items={tab === 'users' ? data.user_items : data.partner_items} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
