import { PartnersData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from '@/lib/animations';
import partnerCabinetMockup from '@/assets/partner-cabinet-mockup.jpeg';

const advantageIcons = [TrendingUp, DollarSign, Users, BarChart3];

interface Props {
  data: PartnersData;
  onPartnerClick: () => void;
}

export function PartnersSection({ data, onPartnerClick }: Props) {
  const { lang } = useLanguage();

  return (
    <section id="for-partners" className="section-padding section-alt overflow-hidden">
      <div className="container mx-auto">
        <motion.h2
          className="heading-lg text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          {data.title}
        </motion.h2>

        {/* Advantages */}
        <motion.div
          className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {data.advantages.map((adv, i) => {
            const Icon = advantageIcons[i % advantageIcons.length];
            return (
              <motion.div
                key={i}
                className="card-elevated transition-shadow duration-300"
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: 'hsl(var(--gold-light))' }}>
                  <Icon size={16} style={{ color: 'hsl(var(--gold-dark))' }} />
                </div>
                <h3 className="font-bold mb-1">{adv.title}</h3>
                <p className="text-sm text-muted-foreground">{adv.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Partner cabinet mockup */}
        <motion.div
          className="flex justify-center my-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
          >
            <div className="relative mx-auto w-[260px] md:w-[300px]">
              <div className="rounded-[2.5rem] border-[6px] border-foreground/90 bg-foreground/90 p-1.5 shadow-2xl">
              <div className="overflow-hidden rounded-[2rem] bg-background">
                  <img
                    src={partnerCabinetMockup}
                    alt="Кабинет партнёра subday"
                    className="w-full h-auto object-contain block"
                  />
                </div>
              </div>
              <div className="absolute -inset-4 -z-10 rounded-[3rem] opacity-30 blur-2xl gold-gradient" />
            </div>
          </motion.div>
        </motion.div>

        {/* Steps */}
        <motion.h2
          className="heading-lg text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          {lang === 'ru' ? 'Как подключиться' : 'Қалай қосылу'}
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {data.steps.map((step, i) => (
            <motion.div
              key={i}
              className="text-center"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="step-number mx-auto mb-5"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {i + 1}
              </motion.div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-body-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {data.conditions && (
          <motion.p
            className="text-center text-sm text-muted-foreground mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            {data.conditions}
          </motion.p>
        )}

        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <button onClick={onPartnerClick} className="btn-gold">
            {lang === 'ru' ? 'Стать партнёром' : 'Серіктес болу'}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
