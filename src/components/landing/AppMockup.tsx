import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/animations';
import appMockup from '@/assets/app-mockup.jpeg';

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
          <div className="relative mx-auto w-[260px] md:w-[300px]">
            <div className="rounded-[2.5rem] border-[6px] border-foreground/90 bg-foreground/90 p-1.5 shadow-2xl">
              <div className="overflow-hidden rounded-[2rem] bg-background">
                <img
                  src={appMockup}
                  alt="subday app"
                  className="w-full h-auto block"
                />
              </div>
            </div>
            <div className="absolute -inset-4 -z-10 rounded-[3rem] opacity-30 blur-2xl gold-gradient" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
