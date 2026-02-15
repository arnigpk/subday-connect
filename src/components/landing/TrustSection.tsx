import { TrustData } from '@/lib/types';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, fadeIn, scaleIn, staggerContainer } from '@/lib/animations';
import {
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface Props {
  data: TrustData;
}

export function TrustSection({ data }: Props) {
  const partnerLogos = data.partner_logos || [];
  const partnerLogosTitle = data.partner_logos_title || 'Наши партнёры';

  const reviewsAutoplay = data.reviews.length > 2
    ? [Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })]
    : [];

  const logosAutoplay = partnerLogos.length > 4
    ? [Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })]
    : [];

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

        {/* Reviews Carousel */}
        {data.reviews.length > 0 && (
          <motion.div
            className="max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <Carousel opts={{ align: 'start', loop: true }} plugins={reviewsAutoplay} className="w-full">
              <CarouselContent className="-ml-4">
                {data.reviews.map((review, i) => (
                  <CarouselItem key={i} className="pl-4 md:basis-1/2">
                    <div className="card-elevated h-full">
                      <Quote size={20} className="mb-4 opacity-20" />
                      <p className="text-body-sm mb-4">{review.text}</p>
                      <div>
                        <div className="font-semibold text-sm">{review.author}</div>
                        <div className="text-xs text-muted-foreground">{review.role}</div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {data.reviews.length > 2 && (
                <>
                  <CarouselPrevious className="-left-4 md:-left-12" />
                  <CarouselNext className="-right-4 md:-right-12" />
                </>
              )}
            </Carousel>
          </motion.div>
        )}

        {/* Partner Logos */}
        {partnerLogos.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-center mb-8">{partnerLogosTitle}</h3>

            {partnerLogos.length > 4 ? (
              <Carousel opts={{ align: 'start', loop: true }} plugins={logosAutoplay} className="w-full max-w-4xl mx-auto">
                <CarouselContent className="-ml-4">
                  {partnerLogos.map((logo, i) => (
                    <CarouselItem key={i} className="pl-4 basis-1/3 md:basis-1/5">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-accent/50 border border-border flex items-center justify-center overflow-hidden p-3">
                          <img src={logo.url} alt={logo.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        {logo.name && (
                          <span className="text-xs text-muted-foreground text-center max-w-[6rem] truncate">{logo.name}</span>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 md:-left-12" />
                <CarouselNext className="-right-4 md:-right-12" />
              </Carousel>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {partnerLogos.map((logo, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center gap-2"
                    variants={scaleIn}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-accent/50 border border-border flex items-center justify-center overflow-hidden p-3">
                      <img src={logo.url} alt={logo.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    {logo.name && (
                      <span className="text-xs text-muted-foreground text-center max-w-[6rem] truncate">{logo.name}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
