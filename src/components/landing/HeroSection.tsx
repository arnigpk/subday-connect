import { HeroData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from '@/lib/animations';
import { useIsMobile } from '@/hooks/use-mobile';
import appStoreLogo from '@/assets/app-store.png';
import googlePlayLogo from '@/assets/google-play.png';
import appMockup from '@/assets/app-mockup.png';
import heroMobile from '@/assets/hero-mobile.png';
import heroDesktop from '@/assets/hero-desktop.png';

interface Props {
  data: HeroData;
  onPartnerClick: () => void;
}

export function HeroSection({ data, onPartnerClick }: Props) {
  const { lang } = useLanguage();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <section className="w-full pt-20 pb-4 px-4">
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '9/16' }}>
          <img
            src={heroMobile}
            alt="subday app"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-5 pt-20 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            <motion.div
              className="flex flex-col items-center gap-3"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div
                className="grid grid-cols-2 gap-3 w-full"
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
                className="btn-gold w-full"
                variants={fadeUp}
              >
                {lang === 'ru' ? 'Стать партнёром' : 'Серіктес болу'}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pt-20 pb-4 px-4 md:px-6 lg:px-8">
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ minHeight: '70vh' }}>
        <img
          src={heroDesktop}
          alt="subday app"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12 lg:p-16 bg-gradient-to-t from-black/40 to-transparent">
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.a
              href={data.app_store_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark gap-2 text-sm justify-center"
              variants={fadeUp}
            >
              <img src={appStoreLogo} alt="App Store" className="h-5 w-5 object-contain" />
              App Store
            </motion.a>
            <motion.a
              href={data.google_play_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark gap-2 text-sm justify-center"
              variants={fadeUp}
            >
              <img src={googlePlayLogo} alt="Google Play" className="h-5 w-5 object-contain" />
              Google Play
            </motion.a>
            <motion.button onClick={onPartnerClick} className="btn-gold" variants={fadeUp}>
              {lang === 'ru' ? 'Стать партнёром' : 'Серіктес болу'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
