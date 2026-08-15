import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { KeyRound, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const MIN_LENGTH = 8;

/**
 * Смена пароля администратора сайта.
 *
 * На странице входа нет восстановления пароля, поэтому забытый пароль означал
 * поход в admin API на сервере. Меняем прямо здесь.
 *
 * Текущий пароль спрашиваем не для проформы: Supabase меняет пароль по одному
 * лишь действующему токену, а значит открытая без присмотра админка позволила бы
 * увести доступ. Проверяем его отдельным входом — на текущую сессию это не
 * влияет.
 */
export function PasswordCard() {
  const [email, setEmail] = useState('');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ''));
  }, []);

  const submit = async () => {
    if (!current || !next) {
      toast.error('Заполните текущий и новый пароль');
      return;
    }
    if (next.length < MIN_LENGTH) {
      toast.error(`Новый пароль — минимум ${MIN_LENGTH} символов`);
      return;
    }
    if (next !== repeat) {
      toast.error('Новый пароль и подтверждение не совпадают');
      return;
    }
    if (next === current) {
      toast.error('Новый пароль совпадает со старым');
      return;
    }

    setSaving(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (authError) {
        toast.error('Текущий пароль неверный');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) {
        toast.error(error.message);
        return;
      }

      setCurrent('');
      setNext('');
      setRepeat('');
      toast.success('Пароль изменён');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Не удалось сменить пароль');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[hsl(220,10%,11%)] rounded-2xl border border-[hsl(220,10%,18%)] p-6 space-y-5 mt-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--gold)/0.15)] flex items-center justify-center">
          <KeyRound size={20} className="text-[hsl(var(--gold))]" />
        </div>
        <div>
          <h3 className="font-semibold text-[14px] text-white">Пароль администратора</h3>
          <p className="text-[11px] text-[hsl(220,10%,45%)]">{email || 'вход в админку'}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,45%)]">
          Текущий пароль
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="admin-input"
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,45%)]">
          Новый пароль
        </label>
        <input
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="admin-input"
          placeholder={`минимум ${MIN_LENGTH} символов`}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,45%)]">
          Повторите новый пароль
        </label>
        <input
          type="password"
          autoComplete="new-password"
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
          className="admin-input"
          placeholder="••••••••"
        />
      </div>

      <button
        onClick={submit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold-dark))] transition-all disabled:opacity-60"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        Сменить пароль
      </button>
    </div>
  );
}
