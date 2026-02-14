import { StepsData } from '@/lib/types';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface Props {
  data: StepsData;
}

export function StepsSection({ data }: Props) {
  return (
    <section id="how-it-works" className="section-padding section-alt overflow-hidden">
      <div className="container mx-auto">
        <motion.h2
          className="heading-lg text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          {data.title}
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {data.items.map((step, i) => (
            <motion.div
              key={i}
              className="text-center"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="step-number mx-auto mb-5"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {i + 1}
              </motion.div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-body-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
