import { UsersData } from '@/lib/types';
import { Percent, MapPin, Smartphone } from 'lucide-react';

const icons = [Percent, MapPin, Smartphone];

interface Props {
  data: UsersData;
}

export function UsersSection({ data }: Props) {
  return (
    <section id="for-users" className="section-padding">
      <div className="container mx-auto">
        <h2 className="heading-lg text-center mb-16">{data.title}</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {data.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={i} className="card-elevated transition-shadow duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 gold-gradient">
                  <Icon size={18} className="text-gold-foreground" style={{ color: 'hsl(var(--gold-foreground))' }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-body-sm text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
