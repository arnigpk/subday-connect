import { useState } from 'react';
import { FooterData } from '@/lib/types';
import { Mail, Phone, MapPin, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';
import logoSubday from '@/assets/logo-subday.png';

interface Props {
  data: FooterData;
}

export function FooterSection({ data }: Props) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const { lang } = useLanguage();

  const t = (ru: string, kz: string) => (lang === 'ru' ? ru : kz);

  return (
    <>
      <motion.footer
        className="border-t border-border py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <div className="container mx-auto">
          <motion.div className="grid md:grid-cols-3 gap-8" variants={fadeUp} transition={{ duration: 0.6 }}>
            <div>
              <img src={logoSubday} alt="subday" className="h-8 mb-4" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin size={14} />
                {data.city}
              </div>
              {data.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Mail size={14} />
                  <a href={`mailto:${data.email}`} className="hover:text-foreground transition-colors">{data.email}</a>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} />
                  <a href={`tel:${data.phone}`} className="hover:text-foreground transition-colors">{data.phone}</a>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setRulesOpen(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {t('Правила сервиса', 'Сервис ережелері')}
              </button>
            </div>

            <div className="text-sm text-muted-foreground md:text-right">
              © {new Date().getFullYear()} subday. All rights reserved.
            </div>
          </motion.div>
        </div>
      </motion.footer>

      {rulesOpen && (
        <div className="modal-overlay" onClick={() => setRulesOpen(false)}>
          <div
            className="bg-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-bold">
                {t('Правила сервиса', 'Сервис ережелері')}
              </h3>
              <button onClick={() => setRulesOpen(false)} className="p-1 hover:bg-accent rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src="https://i.subday.app/service-rules"
                className="w-full h-full min-h-[70vh] border-0"
                title={t('Правила сервиса', 'Сервис ережелері')}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
