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
  const [form, setForm] = useState({ name: '', phone: '', venue: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const t = (ru: string, kz: string) => (lang === 'ru' ? ru : kz);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    let result = '+7';
    if (digits.length > 1) result += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) result += ') ';
    if (digits.length > 4) result += digits.slice(4, 7);
    if (digits.length > 7) result += '-' + digits.slice(7, 9);
    if (digits.length > 9) result += '-' + digits.slice(9, 11);
    return result;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow clearing
    if (raw === '') { setForm({ ...form, phone: '' }); return; }
    const formatted = formatPhone(raw);
    setForm({ ...form, phone: formatted });
  };

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
      setForm({ name: '', phone: '', venue: '' });
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
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={form.phone}
              onChange={handlePhoneChange}
              onFocus={() => { if (!form.phone) setForm({ ...form, phone: '+7' }); }}
              className="input-field"
              required
              maxLength={18}
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
