import { FooterData } from '@/lib/types';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import logoSubday from '@/assets/logo-subday.png';

interface Props {
  data: FooterData;
}

export function FooterSection({ data }: Props) {
  return (
    <motion.footer
      className="border-t border-border py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="container mx-auto">
        <motion.div className="grid md:grid-cols-3 gap-8" variants={fadeUp} transition={{ duration: 0.6 }}>
          <div>
            <img src={logoSubday} alt="subday" className="h-8 mb-4" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin size={14} />
              {data.city}
            </div>
            {data.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Mail size={14} />
                <a href={`mailto:${data.email}`} className="hover:text-foreground transition-colors">{data.email}</a>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} />
                <a href={`tel:${data.phone}`} className="hover:text-foreground transition-colors">{data.phone}</a>
              </div>
            )}
          </div>

          <div>
            {data.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-sm text-muted-foreground md:text-right">
            © {new Date().getFullYear()} subday. All rights reserved.
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
