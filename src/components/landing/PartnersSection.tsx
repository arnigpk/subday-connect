import { PartnersData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from '@/lib/animations';

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
          className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl mx-auto mb-10"
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
            {lang === 'ru' ? 'Оставить заявку' : 'Өтінім қалдыру'}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
