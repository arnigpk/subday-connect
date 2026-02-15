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
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.h1
              className="heading-xl whitespace-pre-line mb-6"
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {data.title}
            </motion.h1>
            <motion.p
              className="text-body text-muted-foreground max-w-xl mb-10"
              variants={fadeUp}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {data.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
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
      </motion.div>
    </section>
  );
}
