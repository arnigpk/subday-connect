import { TrustData } from '@/lib/types';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, fadeIn, scaleIn, staggerContainer } from '@/lib/animations';

interface Props {
  data: TrustData;
}

export function TrustSection({ data }: Props) {
  return (
    <section id="trust" className="section-padding overflow-hidden">
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

        {/* Logos */}
        {data.logos.length > 0 && (
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mb-16 opacity-60"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {data.logos.map((logo, i) => (
              <motion.img
                key={i}
                src={logo.url}
                alt={logo.alt}
                className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition-all"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
              />
            ))}
          </motion.div>
        )}

        {/* Metrics */}
        <motion.div
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {data.metrics.map((m, i) => (
            <motion.div
              key={i}
              className="text-center"
              variants={scaleIn}
              transition={{ duration: 0.5 }}
            >
              <div className="text-3xl md:text-4xl font-extrabold gold-text mb-1">{m.value}</div>
              <div className="text-sm text-muted-foreground">{m.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reviews */}
        {data.reviews.length > 0 && (
          <motion.div
            className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {data.reviews.map((review, i) => (
              <motion.div
                key={i}
                className="card-elevated"
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Quote size={20} className="mb-4 opacity-20" />
                <p className="text-body-sm mb-4">{review.text}</p>
                <div>
                  <div className="font-semibold text-sm">{review.author}</div>
                  <div className="text-xs text-muted-foreground">{review.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
