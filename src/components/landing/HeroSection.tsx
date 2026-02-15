import { HeroData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from '@/lib/animations';
import appStoreLogo from '@/assets/app-store.png';
import googlePlayLogo from '@/assets/google-play.png';
import appMockup from '@/assets/app-mockup.jpeg';

interface Props {
  data: HeroData;
  onPartnerClick: () => void;
}

export function HeroSection({ data, onPartnerClick }: Props) {
  const { lang } = useLanguage();

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <motion.div
        className="container mx-auto"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              className="heading-xl max-w-3xl mx-auto lg:mx-0 whitespace-pre-line mb-6"
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {data.title}
            </motion.h1>
            <motion.p
              className="text-body text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10"
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {data.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
              variants={fadeUp}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <a
                href={data.app_store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark gap-2 w-full sm:w-auto"
              >
                <img src={appStoreLogo} alt="App Store" className="h-5 w-5 object-contain" />
                App Store
              </a>
              <a
                href={data.google_play_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark gap-2 w-full sm:w-auto"
              >
                <img src={googlePlayLogo} alt="Google Play" className="h-5 w-5 object-contain" />
                Google Play
              </a>
              <button onClick={onPartnerClick} className="btn-gold w-full sm:w-auto">
                {lang === 'ru' ? 'Оставить заявку' : 'Өтінім қалдыру'}
              </button>
            </motion.div>
          </div>

          {/* Phone mockup */}
          <motion.div
            className="flex-shrink-0"
            variants={scaleIn}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          >
            <div className="relative mx-auto w-[260px] md:w-[300px]">
              {/* Phone frame */}
              <div className="rounded-[2.5rem] border-[6px] border-foreground/90 bg-foreground/90 p-1.5 shadow-2xl">
                <div className="overflow-hidden rounded-[2rem] bg-background">
                  <img
                    src={appMockup}
                    alt="subday app"
                    className="w-full h-auto block"
                  />
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 -z-10 rounded-[3rem] opacity-30 blur-2xl gold-gradient" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
