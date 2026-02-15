import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/animations';
import { IPhoneFrame } from './IPhoneFrame';
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
          <IPhoneFrame src={appMockup} alt="subday app" />
        </motion.div>
      </motion.div>
    </section>
  );
}
