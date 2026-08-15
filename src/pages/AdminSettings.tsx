import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { PasswordCard } from '@/components/admin/PasswordCard';
import { Save, Send, Loader2, HelpCircle, Bot } from 'lucide-react';
import { toast } from 'sonner';

interface TelegramSettings {
  telegram_enabled: boolean;
  telegram_bot_token: string;
  telegram_chat_id: string;
}

function SettingsContent() {
  const [settings, setSettings] = useState<TelegramSettings>({
    telegram_enabled: false,
    telegram_bot_token: '',
    telegram_chat_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [chatIds, setChatIds] = useState<{ id: string; name: string }[]>([]);
  const [fetchingIds, setFetchingIds] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .single();
      if (!error && data) {
        setSettings({
          telegram_enabled: (data as Record<string, unknown>).telegram_enabled as boolean || false,
          telegram_bot_token: (data as Record<string, unknown>).telegram_bot_token as string || '',
          telegram_chat_id: (data as Record<string, unknown>).telegram_chat_id as string || '',
        });
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'main', ...settings } as Record<string, unknown>);
    if (error) toast.error(error.message);
    else toast.success('Настройки сохранены');
    setSaving(false);
  };

  const testMessage = async () => {
    if (!settings.telegram_bot_token || !settings.telegram_chat_id) {
      toast.error('Заполните Bot Token и Chat ID');
      return;
    }
    setTesting(true);
    try {
      const res = await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: settings.telegram_chat_id, text: '✅ Тестовое сообщение от subday!' }),
      });
      const data = await res.json();
      if (data.ok) toast.success('Сообщение отправлено!');
      else toast.error(data.description || 'Ошибка отправки');
    } catch {
      toast.error('Ошибка сети');
    }
    setTesting(false);
  };

  const fetchChatIds = async () => {
    if (!settings.telegram_bot_token) { toast.error('Введите Bot Token'); return; }
    setFetchingIds(true);
    try {
      const res = await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/getUpdates`);
      const data = await res.json();
      if (!data.ok) { toast.error('Ошибка'); setFetchingIds(false); return; }
      const ids = new Map<string, string>();
      for (const update of data.result || []) {
        const chat = update.message?.chat || update.my_chat_member?.chat;
        if (chat) ids.set(String(chat.id), chat.first_name || chat.title || String(chat.id));
      }
      setChatIds(Array.from(ids).map(([id, name]) => ({ id, name })));
      if (ids.size === 0) toast.info('Нет чатов. Напишите боту /start и попробуйте снова.');
    } catch {
      toast.error('Ошибка сети');
    }
    setFetchingIds(false);
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-[hsl(220,10%,30%)]" /></div>;

  return (
    <div className="p-4 lg:p-6 max-w-xl">
      <h2 className="text-lg font-bold text-white mb-6">Настройки</h2>

      <div className="bg-[hsl(220,10%,11%)] rounded-2xl border border-[hsl(220,10%,18%)] p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <Bot size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-white">Telegram уведомления</h3>
            <p className="text-[11px] text-[hsl(220,10%,45%)]">Получайте заявки в Telegram</p>
          </div>
        </div>

        {/* Переключатель нарисован вручную, поэтому состояние переключает кнопка:
            раньше это был просто раскрашенный div, и значение изменить было нельзя. */}
        <button
          type="button"
          role="switch"
          aria-checked={settings.telegram_enabled}
          onClick={() => setSettings((prev) => ({ ...prev, telegram_enabled: !prev.telegram_enabled }))}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className={`w-10 h-6 rounded-full transition-all relative ${settings.telegram_enabled ? 'bg-[hsl(var(--gold))]' : 'bg-[hsl(220,10%,20%)]'}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.telegram_enabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-[13px] text-[hsl(220,10%,70%)]">Включить уведомления</span>
        </button>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,45%)]">Bot Token</label>
          <input
            type="password"
            value={settings.telegram_bot_token}
            onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
            className="admin-input"
            placeholder="123456789:ABC..."
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(220,10%,45%)]">Chat ID</label>
            <button onClick={() => setShowHelper(!showHelper)} className="text-[hsl(220,10%,40%)] hover:text-[hsl(var(--gold))] transition-colors">
              <HelpCircle size={13} />
            </button>
          </div>
          <input
            value={settings.telegram_chat_id}
            onChange={(e) => setSettings({ ...settings, telegram_chat_id: e.target.value })}
            className="admin-input"
            placeholder="123456789"
          />
        </div>

        {showHelper && (
          <div className="bg-[hsl(220,10%,14%)] rounded-xl p-4 space-y-3 border border-[hsl(220,10%,20%)]">
            <p className="text-[12px] text-[hsl(220,10%,55%)]">
              1. Напишите боту /start в Telegram<br />
              2. Нажмите «Получить Chat ID» ниже<br />
              3. Выберите нужный чат
            </p>
            <button onClick={fetchChatIds} disabled={fetchingIds} className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium bg-[hsl(220,10%,18%)] border border-[hsl(220,10%,25%)] text-[hsl(220,10%,65%)] hover:text-white transition-all">
              {fetchingIds ? <Loader2 size={12} className="animate-spin" /> : <HelpCircle size={12} />}
              Получить Chat ID
            </button>
            {chatIds.length > 0 && (
              <div className="space-y-1">
                {chatIds.map((c) => (
                  <button key={c.id} onClick={() => { setSettings({ ...settings, telegram_chat_id: c.id }); setShowHelper(false); }}
                    className="block w-full text-left text-[12px] p-2 rounded-lg hover:bg-[hsl(220,10%,18%)] text-[hsl(220,10%,65%)] transition-colors">
                    {c.name} — <code className="text-[hsl(var(--gold))]">{c.id}</code>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold-dark))] transition-all">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Сохранить
          </button>
          <button onClick={testMessage} disabled={testing} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium bg-[hsl(220,10%,14%)] border border-[hsl(220,10%,20%)] text-[hsl(220,10%,65%)] hover:text-white hover:border-[hsl(220,10%,30%)] transition-all">
            {testing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Тест
          </button>
        </div>
      </div>

      <PasswordCard />
    </div>
  );
}

export default function AdminSettings() {
  return (
    <AdminGuard>
      <AdminLayout>
        <SettingsContent />
      </AdminLayout>
    </AdminGuard>
  );
}
