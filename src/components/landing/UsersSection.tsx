import { UsersData } from '@/lib/types';
import { Percent, MapPin, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from '@/lib/animations';

const icons = [Percent, MapPin, Smartphone];

interface Props {
  data: UsersData;
}

export function UsersSection({ data }: Props) {
  return (
    <section id="for-users" className="section-padding overflow-hidden">
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
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {data.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={i}
                className="card-elevated transition-shadow duration-300"
                variants={scaleIn}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 gold-gradient"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon size={18} className="text-gold-foreground" style={{ color: 'hsl(var(--gold-foreground))' }} />
                </motion.div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-body-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
