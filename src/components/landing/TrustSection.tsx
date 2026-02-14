import { TrustData } from '@/lib/types';
import { Quote } from 'lucide-react';

interface Props {
  data: TrustData;
}

export function TrustSection({ data }: Props) {
  return (
    <section id="trust" className="section-padding">
      <div className="container mx-auto">
        <h2 className="heading-lg text-center mb-16">{data.title}</h2>

        {/* Logos */}
        {data.logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8 mb-16 opacity-60">
            {data.logos.map((logo, i) => (
              <img
                key={i}
                src={logo.url}
                alt={logo.alt}
                className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16">
          {data.metrics.map((m, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold gold-text mb-1">{m.value}</div>
              <div className="text-sm text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        {data.reviews.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {data.reviews.map((review, i) => (
              <div key={i} className="card-elevated">
                <Quote size={20} className="mb-4 opacity-20" />
                <p className="text-body-sm mb-4">{review.text}</p>
                <div>
                  <div className="font-semibold text-sm">{review.author}</div>
                  <div className="text-xs text-muted-foreground">{review.role}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
