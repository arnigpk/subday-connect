import { CtaData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import appStoreLogo from '@/assets/app-store.png';
import googlePlayLogo from '@/assets/google-play.png';

interface Props {
  data: CtaData;
  onPartnerClick: () => void;
}

export function CtaSection({ data, onPartnerClick }: Props) {
  const { lang } = useLanguage();

  return (
    <section className="section-padding overflow-hidden">
      <motion.div
        className="container mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.h2 className="heading-lg mb-4" variants={fadeUp} transition={{ duration: 0.6 }}>
          {data.title}
        </motion.h2>
        <motion.p className="text-body text-muted-foreground mb-10" variants={fadeUp} transition={{ duration: 0.5 }}>
          {data.subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col items-center justify-center gap-3 w-full max-w-md mx-auto sm:max-w-none sm:w-auto"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-row gap-3">
            <a href={data.app_store_url} target="_blank" rel="noopener noreferrer" className="btn-dark gap-2 text-xs sm:text-sm justify-center flex-1">
              <img src={appStoreLogo} alt="App Store" className="h-4 w-4 sm:h-5 sm:w-5 object-contain" />
              App Store
            </a>
            <a href={data.google_play_url} target="_blank" rel="noopener noreferrer" className="btn-dark gap-2 text-xs sm:text-sm justify-center flex-1">
              <img src={googlePlayLogo} alt="Google Play" className="h-4 w-4 sm:h-5 sm:w-5 object-contain" />
              Google Play
            </a>
          </div>
          <button onClick={onPartnerClick} className="btn-gold w-full">
            {lang === 'ru' ? 'Стать партнёром' : 'Серіктес болу'}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
