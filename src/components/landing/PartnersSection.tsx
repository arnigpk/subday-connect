import { PartnersData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';

const advantageIcons = [TrendingUp, DollarSign, Users, BarChart3];

interface Props {
  data: PartnersData;
  onPartnerClick: () => void;
}

export function PartnersSection({ data, onPartnerClick }: Props) {
  const { lang } = useLanguage();

  return (
    <section id="for-partners" className="section-padding section-alt">
      <div className="container mx-auto">
        <h2 className="heading-lg text-center mb-16">{data.title}</h2>

        {/* Advantages */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
          {data.advantages.map((adv, i) => {
            const Icon = advantageIcons[i % advantageIcons.length];
            return (
              <div key={i} className="card-elevated transition-shadow duration-300">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: 'hsl(var(--gold-light))' }}>
                  <Icon size={16} style={{ color: 'hsl(var(--gold-dark))' }} />
                </div>
                <h3 className="font-bold mb-1">{adv.title}</h3>
                <p className="text-sm text-muted-foreground">{adv.description}</p>
              </div>
            );
          })}
        </div>

        {/* Steps */}
        <h3 className="heading-md text-center mb-10">
          {lang === 'ru' ? 'Как подключиться' : 'Қалай қосылу'}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-10">
          {data.steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="step-number mx-auto mb-4">{i + 1}</div>
              <h4 className="font-semibold mb-1">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        {data.conditions && (
          <p className="text-center text-sm text-muted-foreground mb-8">{data.conditions}</p>
        )}

        <div className="text-center">
          <button onClick={onPartnerClick} className="btn-gold">
            {lang === 'ru' ? 'Оставить заявку' : 'Өтінім қалдыру'}
          </button>
        </div>
      </div>
    </section>
  );
}
