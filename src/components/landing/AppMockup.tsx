import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/animations';
import appMockupAsset from '@/assets/app-mockup.png.asset.json';
const appMockup = appMockupAsset.url;

export function AppMockup() {
  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <motion.div
        className="flex justify-center"
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
          <div className="relative mx-auto w-[280px] md:w-[340px]">
            <img
              src={appMockup}
              alt="subday app"
              className="w-full h-auto object-contain block relative z-10"
            />
            <div className="absolute -inset-4 -z-10 rounded-[3rem] opacity-30 blur-2xl gold-gradient" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
