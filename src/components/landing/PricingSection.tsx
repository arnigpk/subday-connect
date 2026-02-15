import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';
import appMockup from '@/assets/app-mockup.png';
import { Sparkles, Flame, Rocket } from 'lucide-react';

const plans = [
  {
    name: 'subday Go',
    emoji: '✅',
    description: 'Попробуй и будь в числе первых!',
    badge: 'Try & Go',
    badgeColor: 'bg-emerald-500 text-white',
    coffees: '15 кофе на 15 дней',
    price: '14 990',
    period: '/ 15 дней',
    saving: '7 500',
    popular: false,
  },
  {
    name: 'subday Daily',
    emoji: '🔥',
    description: 'Капучино или Латте каждый день',
    badge: 'Хит',
    badgeColor: 'bg-orange-500 text-white',
    coffees: '30 кофе на 30 дней',
    price: '29 990',
    period: '/ месяц',
    saving: '15 000',
    popular: true,
  },
  {
    name: 'subday Plus',
    emoji: '🚀',
    description: 'Для тех, кто хочет попробовать всё',
    badge: 'Max',
    badgeColor: 'bg-teal-600 text-white',
    coffees: '30 кофе на 30 дней',
    price: '44 990',
    period: '/ месяц',
    saving: '9 000',
    popular: false,
  },
];

export function PricingSection() {
  const { lang } = useLanguage();

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          className="heading-lg text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          {lang === 'ru' ? 'Тарифы' : 'Тарифтер'}
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Phone mockup */}
          <motion.div
            className="flex-shrink-0"
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
              <div className="relative mx-auto w-[220px] md:w-[260px]">
                <div className="rounded-[2.5rem] border-[6px] border-foreground/90 bg-foreground/90 p-1.5 shadow-2xl">
                  <div className="overflow-hidden rounded-[2rem] bg-background">
                    <img
                      src={appMockup}
                      alt="subday app"
                      className="w-full h-auto object-contain block"
                    />
                  </div>
                </div>
                <div className="absolute -inset-4 -z-10 rounded-[3rem] opacity-30 blur-2xl gold-gradient" />
              </div>
            </motion.div>
          </motion.div>

          {/* Pricing cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 flex-1 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                className={`relative card-elevated flex flex-col transition-shadow duration-300 ${
                  plan.popular ? 'ring-2 ring-[hsl(var(--gold))] shadow-lg' : ''
                }`}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">
                      {plan.name} <span>{plan.emoji}</span>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{plan.description}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>

                {/* Coffee count */}
                <div className="inline-flex items-center gap-1.5 bg-[hsl(var(--gold-light))] text-[hsl(var(--gold-dark))] text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                  ☕ {plan.coffees}
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1.5">тг {plan.period}</span>
                </div>

                <p className="font-semibold text-sm mb-5" style={{ color: 'hsl(var(--gold-dark))' }}>
                  Выгода {plan.saving} ₸
                </p>

                {/* CTA */}
                <button className="btn-gold w-full mt-auto">
                  {lang === 'ru' ? 'Оформить' : 'Рәсімдеу'}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
