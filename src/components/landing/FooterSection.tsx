import { FooterData } from '@/lib/types';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Props {
  data: FooterData;
}

export function FooterSection({ data }: Props) {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-lg font-extrabold mb-4">subday</div>
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
        </div>
      </div>
    </footer>
  );
}
