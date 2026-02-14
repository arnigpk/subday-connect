import { StepsData } from '@/lib/types';

interface Props {
  data: StepsData;
}

export function StepsSection({ data }: Props) {
  return (
    <section id="how-it-works" className="section-padding section-alt">
      <div className="container mx-auto">
        <h2 className="heading-lg text-center mb-16">{data.title}</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {data.items.map((step, i) => (
            <div key={i} className="text-center">
              <div className="step-number mx-auto mb-5">
                {i + 1}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-body-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
