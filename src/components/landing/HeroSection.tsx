import { HeroData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from '@/lib/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import appStoreLogo from '@/assets/app-store.png';
import googlePlayLogo from '@/assets/google-play.png';
import appMockup from '@/assets/app-mockup.png';
import heroMobile from '@/assets/hero-mobile.png';

interface Props {
  data: HeroData;
  onPartnerClick: () => void;
}

export function HeroSection({ data, onPartnerClick }: Props) {
  const { lang } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <section className="relative w-full min-h-[85vh] flex flex-col">
        <img
          src={heroMobile}
          alt="subday app"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 mt-auto px-4 pb-8 pt-16 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <motion.div
            className="flex flex-col items-center gap-3"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              className="grid grid-cols-2 gap-3 w-full max-w-xs"
              variants={fadeUp}
            >
              <a
                href={data.app_store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark gap-2 text-xs justify-center"
              >
                <img src={appStoreLogo} alt="App Store" className="h-4 w-4 object-contain" />
                App Store
              </a>
              <a
                href={data.google_play_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark gap-2 text-xs justify-center"
              >
                <img src={googlePlayLogo} alt="Google Play" className="h-4 w-4 object-contain" />
                Google Play
              </a>
            </motion.div>
            <motion.button
              onClick={onPartnerClick}
              className="btn-gold w-full max-w-xs"
              variants={fadeUp}
            >
              {lang === 'ru' ? 'Стать партнёром' : 'Серіктес болу'}
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
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
              className="flex flex-col items-center justify-center gap-3 w-full max-w-md mx-auto sm:max-w-none sm:w-auto"
              variants={fadeUp}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:flex-row sm:w-auto">
                <a
                  href={data.app_store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark gap-2 text-xs sm:text-sm justify-center"
                >
                  <img src={appStoreLogo} alt="App Store" className="h-4 w-4 sm:h-5 sm:w-5 object-contain" />
                  App Store
                </a>
                <a
                  href={data.google_play_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark gap-2 text-xs sm:text-sm justify-center"
                >
                  <img src={googlePlayLogo} alt="Google Play" className="h-4 w-4 sm:h-5 sm:w-5 object-contain" />
                  Google Play
                </a>
              </div>
              <button onClick={onPartnerClick} className="btn-gold w-full sm:w-auto">
                {lang === 'ru' ? 'Стать партнёром' : 'Серіктес болу'}
              </button>
            </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
