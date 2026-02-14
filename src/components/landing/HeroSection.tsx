import { HeroData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Apple, Play } from 'lucide-react';

interface Props {
  data: HeroData;
  onPartnerClick: () => void;
}

export function HeroSection({ data, onPartnerClick }: Props) {
  const { lang } = useLanguage();

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="container mx-auto text-center">
        <h1 className="heading-xl max-w-3xl mx-auto whitespace-pre-line mb-6">
          {data.title}
        </h1>
        <p className="text-body text-muted-foreground max-w-xl mx-auto mb-10">
          {data.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={data.app_store_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark gap-2 w-full sm:w-auto"
          >
            <Apple size={18} />
            App Store
          </a>
          <a
            href={data.google_play_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark gap-2 w-full sm:w-auto"
          >
            <Play size={18} />
            Google Play
          </a>
          <button onClick={onPartnerClick} className="btn-gold w-full sm:w-auto">
            {lang === 'ru' ? 'Оставить заявку' : 'Өтінім қалдыру'}
          </button>
        </div>
      </div>
    </section>
  );
}
