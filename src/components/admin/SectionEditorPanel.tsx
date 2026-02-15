import { Section, HeroData, StepsData, UsersData, PartnersData, TrustData, FaqData, CtaData, FooterData } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: Section;
  onChange: (data: Section['data']) => void;
}

function Field({ label, value, onChange, multiline, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className="input-field resize-none text-sm" rows={3} placeholder={placeholder} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="input-field text-sm" placeholder={placeholder} />
      )}
    </div>
  );
}

function ListEditor({
  items, fields, onUpdate, onCreate, label
}: {
  items: Record<string, string>[]; fields: { key: string; label: string; multiline?: boolean }[];
  onUpdate: (items: Record<string, string>[]) => void; onCreate: () => void; label: string;
}) {
  const remove = (i: number) => onUpdate(items.filter((_, idx) => idx !== i));
  const update = (i: number, key: string, val: string) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    onUpdate(copy);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <button onClick={onCreate} className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Plus size={12} /> Добавить
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-xl p-3 space-y-2 relative group">
          <button onClick={() => remove(i)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
            <Trash2 size={14} />
          </button>
          {fields.map((f) => (
            <Field key={f.key} label={f.label} value={String(item[f.key] || '')} onChange={(v) => update(i, f.key, v)} multiline={f.multiline} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SectionEditorPanel({ section, onChange }: Props) {
  const d = section.data as unknown as Record<string, unknown>;

  switch (section.type) {
    case 'hero': {
      const data = d as unknown as HeroData;
      const set = (key: keyof HeroData, val: string) => onChange({ ...data, [key]: val } as HeroData);
      return (
        <div className="space-y-4">
          <Field label="Заголовок" value={data.title} onChange={(v) => set('title', v)} multiline />
          <Field label="Подзаголовок" value={data.subtitle} onChange={(v) => set('subtitle', v)} multiline />
          <Field label="App Store URL" value={data.app_store_url} onChange={(v) => set('app_store_url', v)} />
          <Field label="Google Play URL" value={data.google_play_url} onChange={(v) => set('google_play_url', v)} />
        </div>
      );
    }

    case 'steps': {
      const data = d as unknown as StepsData;
      return (
        <div className="space-y-4">
          <Field label="Заголовок" value={data.title} onChange={(v) => onChange({ ...data, title: v } as StepsData)} />
          <ListEditor
            items={data.items as unknown as Record<string, string>[]}
            fields={[{ key: 'title', label: 'Название' }, { key: 'description', label: 'Описание', multiline: true }]}
            onUpdate={(items) => onChange({ ...data, items } as unknown as StepsData)}
            onCreate={() => onChange({ ...data, items: [...data.items, { title: '', description: '' }] } as StepsData)}
            label="Шаги"
          />
        </div>
      );
    }

    case 'users': {
      const data = d as unknown as UsersData;
      return (
        <div className="space-y-4">
          <Field label="Заголовок" value={data.title} onChange={(v) => onChange({ ...data, title: v } as UsersData)} />
          <ListEditor
            items={data.items as unknown as Record<string, string>[]}
            fields={[{ key: 'title', label: 'Название' }, { key: 'description', label: 'Описание', multiline: true }]}
            onUpdate={(items) => onChange({ ...data, items } as unknown as UsersData)}
            onCreate={() => onChange({ ...data, items: [...data.items, { title: '', description: '' }] } as UsersData)}
            label="Преимущества"
          />
        </div>
      );
    }

    case 'partners': {
      const data = d as unknown as PartnersData;
      return (
        <div className="space-y-6">
          <Field label="Заголовок" value={data.title} onChange={(v) => onChange({ ...data, title: v } as PartnersData)} />
          <ListEditor
            items={data.advantages as unknown as Record<string, string>[]}
            fields={[{ key: 'title', label: 'Название' }, { key: 'description', label: 'Описание', multiline: true }]}
            onUpdate={(advantages) => onChange({ ...data, advantages } as unknown as PartnersData)}
            onCreate={() => onChange({ ...data, advantages: [...data.advantages, { title: '', description: '' }] } as PartnersData)}
            label="Преимущества"
          />
          <ListEditor
            items={data.steps as unknown as Record<string, string>[]}
            fields={[{ key: 'title', label: 'Название' }, { key: 'description', label: 'Описание' }]}
            onUpdate={(steps) => onChange({ ...data, steps } as unknown as PartnersData)}
            onCreate={() => onChange({ ...data, steps: [...data.steps, { title: '', description: '' }] } as PartnersData)}
            label="Шаги подключения"
          />
          <Field label="Условия" value={data.conditions} onChange={(v) => onChange({ ...data, conditions: v } as PartnersData)} multiline />
        </div>
      );
    }

    case 'trust': {
      const data = d as unknown as TrustData;
      const partnerLogos = (data as TrustData).partner_logos || [];
      return (
        <div className="space-y-6">
          <Field label="Заголовок" value={data.title} onChange={(v) => onChange({ ...data, title: v } as TrustData)} />
          <ListEditor
            items={data.metrics as unknown as Record<string, string>[]}
            fields={[{ key: 'value', label: 'Значение' }, { key: 'label', label: 'Подпись' }]}
            onUpdate={(metrics) => onChange({ ...data, metrics } as unknown as TrustData)}
            onCreate={() => onChange({ ...data, metrics: [...data.metrics, { value: '', label: '' }] } as TrustData)}
            label="Метрики"
          />
          <ListEditor
            items={data.reviews as unknown as Record<string, string>[]}
            fields={[{ key: 'text', label: 'Текст', multiline: true }, { key: 'author', label: 'Автор' }, { key: 'role', label: 'Роль' }]}
            onUpdate={(reviews) => onChange({ ...data, reviews } as unknown as TrustData)}
            onCreate={() => onChange({ ...data, reviews: [...data.reviews, { text: '', author: '', role: '' }] } as TrustData)}
            label="Отзывы"
          />
          <ListEditor
            items={data.logos as unknown as Record<string, string>[]}
            fields={[{ key: 'url', label: 'URL изображения' }, { key: 'alt', label: 'Описание' }]}
            onUpdate={(logos) => onChange({ ...data, logos } as unknown as TrustData)}
            onCreate={() => onChange({ ...data, logos: [...data.logos, { url: '', alt: '' }] } as TrustData)}
            label="Логотипы"
          />
          <Field label="Заголовок партнёров" value={(data as TrustData).partner_logos_title || ''} onChange={(v) => onChange({ ...data, partner_logos_title: v } as TrustData)} />
          <ListEditor
            items={partnerLogos as unknown as Record<string, string>[]}
            fields={[{ key: 'url', label: 'URL логотипа' }, { key: 'name', label: 'Название' }]}
            onUpdate={(partner_logos) => onChange({ ...data, partner_logos } as unknown as TrustData)}
            onCreate={() => onChange({ ...data, partner_logos: [...partnerLogos, { url: '', name: '' }] } as TrustData)}
            label="Логотипы партнёров"
          />
        </div>
      );
    }

    case 'faq': {
      const data = d as unknown as FaqData;
      return (
        <div className="space-y-6">
          <Field label="Заголовок" value={data.title} onChange={(v) => onChange({ ...data, title: v } as FaqData)} />
          <ListEditor
            items={data.user_items as unknown as Record<string, string>[]}
            fields={[{ key: 'question', label: 'Вопрос' }, { key: 'answer', label: 'Ответ', multiline: true }]}
            onUpdate={(user_items) => onChange({ ...data, user_items } as unknown as FaqData)}
            onCreate={() => onChange({ ...data, user_items: [...data.user_items, { question: '', answer: '' }] } as FaqData)}
            label="FAQ для пользователей"
          />
          <ListEditor
            items={data.partner_items as unknown as Record<string, string>[]}
            fields={[{ key: 'question', label: 'Вопрос' }, { key: 'answer', label: 'Ответ', multiline: true }]}
            onUpdate={(partner_items) => onChange({ ...data, partner_items } as unknown as FaqData)}
            onCreate={() => onChange({ ...data, partner_items: [...data.partner_items, { question: '', answer: '' }] } as FaqData)}
            label="FAQ для партнёров"
          />
        </div>
      );
    }

    case 'cta': {
      const data = d as unknown as CtaData;
      return (
        <div className="space-y-4">
          <Field label="Заголовок" value={data.title} onChange={(v) => onChange({ ...data, title: v } as CtaData)} />
          <Field label="Подзаголовок" value={data.subtitle} onChange={(v) => onChange({ ...data, subtitle: v } as CtaData)} />
          <Field label="App Store URL" value={data.app_store_url} onChange={(v) => onChange({ ...data, app_store_url: v } as CtaData)} />
          <Field label="Google Play URL" value={data.google_play_url} onChange={(v) => onChange({ ...data, google_play_url: v } as CtaData)} />
        </div>
      );
    }

    case 'footer': {
      const data = d as unknown as FooterData;
      return (
        <div className="space-y-4">
          <Field label="Город" value={data.city} onChange={(v) => onChange({ ...data, city: v } as FooterData)} />
          <Field label="Email" value={data.email} onChange={(v) => onChange({ ...data, email: v } as FooterData)} />
          <Field label="Телефон" value={data.phone} onChange={(v) => onChange({ ...data, phone: v } as FooterData)} />
          <ListEditor
            items={data.links as unknown as Record<string, string>[]}
            fields={[{ key: 'label', label: 'Текст' }, { key: 'url', label: 'URL' }]}
            onUpdate={(links) => onChange({ ...data, links } as unknown as FooterData)}
            onCreate={() => onChange({ ...data, links: [...data.links, { label: '', url: '' }] } as FooterData)}
            label="Ссылки"
          />
        </div>
      );
    }

    default:
      return <p className="text-sm text-muted-foreground">Неизвестный тип секции</p>;
  }
}
