import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function PartnerModal({ open, onClose }: Props) {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ name: '', city: '', phone: '', venue: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const t = (ru: string, kz: string) => (lang === 'ru' ? ru : kz);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await supabase.functions.invoke('submit-lead', {
        body: form,
      });

      if (response.error) throw new Error(response.error.message);

      setSuccess(true);
      setForm({ name: '', city: '', phone: '', venue: '', comment: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {t('Оставить заявку', 'Өтінім қалдыру')}
          </h3>
          <button onClick={handleClose} className="p-1 hover:bg-accent rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto mb-4 gold-text" />
            <h4 className="text-lg font-bold mb-2">
              {t('Спасибо!', 'Рахмет!')}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t('Мы свяжемся с вами в ближайшее время.', 'Жақын арада сізбен хабарласамыз.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={t('Ваше имя', 'Сіздің атыңыз')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              required
              maxLength={100}
            />
            <input
              type="text"
              placeholder={t('Город', 'Қала')}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input-field"
              required
              maxLength={100}
            />
            <input
              type="tel"
              placeholder={t('Номер телефона', 'Телефон нөмірі')}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input-field"
              required
              maxLength={20}
            />
            <input
              type="text"
              placeholder={t('Название заведения', 'Мекеме атауы')}
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="input-field"
              required
              maxLength={200}
            />
            <textarea
              placeholder={t('Комментарий', 'Пікір')}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="input-field resize-none"
              rows={3}
              maxLength={500}
            />

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn-gold w-full">
              {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
              {t('Отправить', 'Жіберу')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
