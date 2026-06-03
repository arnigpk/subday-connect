import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';
import appMockupAsset from '@/assets/app-mockup.png.asset.json';
const appMockup = appMockupAsset.url;

const plans = [
  {
    name: 'subday Go',
    emoji: '✅',
    description: 'Попробуй и будь в числе первых!',
    coffees: '15 кофе на 15 дней',
    price: '16 500',
    period: '/ 15 дней',
    perDrink: '1 100',
    popular: false,
  },
  {
    name: 'subday Daily',
    emoji: '🔥',
    description: 'Капучино или Латте каждый день',
    coffees: '30 кофе на 30 дней',
    price: '32 700',
    period: '/ месяц',
    perDrink: '1 090',
    popular: true,
  },
  {
    name: 'subday Plus',
    emoji: '🚀',
    description: 'Для тех, кто хочет попробовать всё',
    coffees: '30 кофе на 30 дней',
    price: '47 700',
    period: '/ месяц',
    perDrink: '1 590',
    popular: false,
  },
  {
    name: 'subday Max',
    emoji: '👑',
    description: 'Для тех кто любит быть на высоте!',
    coffees: '45 кофе на 30 дней',
    price: '67 050',
    period: '/ месяц',
    perDrink: '1 490',
    popular: false,
  },
];

function PhoneMockup() {
  return (
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
  );
}

export function PricingSection() {
  const { lang } = useLanguage();

  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Desktop: title + cards + mockup */}
        <div className="hidden lg:block">
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

          <div className="flex items-center gap-12 max-w-7xl mx-auto">
            {/* Pricing cards */}
            <motion.div
              className="grid grid-cols-2 gap-5 flex-1"
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
                  <div className="mb-3">
                    <h3 className="font-bold text-lg">
                      {plan.name} <span>{plan.emoji}</span>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{plan.description}</p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-[hsl(var(--gold-light))] text-[hsl(var(--gold-dark))] text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4">
                    ☕ {plan.coffees}
                  </div>

                  <div className="mb-1">
                    <span className="text-3xl md:text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground text-sm ml-1.5">тг {plan.period}</span>
                  </div>

                  <p className="font-semibold text-sm" style={{ color: 'hsl(var(--gold-dark))' }}>
                    {plan.perDrink} ₸ за напиток
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Phone mockup - right side */}
            <PhoneMockup />
          </div>
        </div>

        {/* Mobile/Tablet: only mockup */}
        <div className="lg:hidden flex justify-center">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
