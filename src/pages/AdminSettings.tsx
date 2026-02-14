import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Save, Send, Loader2, HelpCircle } from 'lucide-react';
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
        body: JSON.stringify({
          chat_id: settings.telegram_chat_id,
          text: '✅ Тестовое сообщение от subday!',
        }),
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
    if (!settings.telegram_bot_token) {
      toast.error('Введите Bot Token');
      return;
    }
    setFetchingIds(true);
    try {
      const res = await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/getUpdates`);
      const data = await res.json();
      if (!data.ok) { toast.error('Ошибка'); setFetchingIds(false); return; }

      const ids = new Map<string, string>();
      for (const update of data.result || []) {
        const chat = update.message?.chat || update.my_chat_member?.chat;
        if (chat) {
          ids.set(String(chat.id), chat.first_name || chat.title || String(chat.id));
        }
      }
      setChatIds(Array.from(ids).map(([id, name]) => ({ id, name })));
      if (ids.size === 0) toast.info('Нет чатов. Напишите боту /start и попробуйте снова.');
    } catch {
      toast.error('Ошибка сети');
    }
    setFetchingIds(false);
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-muted-foreground" /></div>;

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-bold mb-6">Настройки</h2>

      <div className="bg-background rounded-xl border border-border p-6 space-y-5">
        <h3 className="font-semibold text-sm">Telegram уведомления</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.telegram_enabled}
            onChange={(e) => setSettings({ ...settings, telegram_enabled: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">Включить уведомления</span>
        </label>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Bot Token</label>
          <input
            type="password"
            value={settings.telegram_bot_token}
            onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
            className="input-field text-sm"
            placeholder="123456789:ABC..."
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">Chat ID</label>
            <button onClick={() => setShowHelper(!showHelper)} className="text-muted-foreground hover:text-foreground">
              <HelpCircle size={13} />
            </button>
          </div>
          <input
            value={settings.telegram_chat_id}
            onChange={(e) => setSettings({ ...settings, telegram_chat_id: e.target.value })}
            className="input-field text-sm"
            placeholder="123456789"
          />
        </div>

        {showHelper && (
          <div className="bg-accent/50 rounded-xl p-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              1. Напишите боту /start в Telegram<br />
              2. Нажмите «Получить Chat ID» ниже<br />
              3. Выберите нужный чат
            </p>
            <button onClick={fetchChatIds} disabled={fetchingIds} className="btn-outline text-xs py-1.5 px-3 gap-1">
              {fetchingIds ? <Loader2 size={12} className="animate-spin" /> : <HelpCircle size={12} />}
              Получить Chat ID
            </button>
            {chatIds.length > 0 && (
              <div className="space-y-1">
                {chatIds.map((c) => (
                  <button key={c.id} onClick={() => { setSettings({ ...settings, telegram_chat_id: c.id }); setShowHelper(false); }}
                    className="block w-full text-left text-xs p-2 rounded-lg hover:bg-background transition-colors">
                    {c.name} — <code>{c.id}</code>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button onClick={save} disabled={saving} className="btn-dark text-xs py-2 px-4 gap-1">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Сохранить
          </button>
          <button onClick={testMessage} disabled={testing} className="btn-outline text-xs py-2 px-4 gap-1">
            {testing ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Тест
          </button>
        </div>
      </div>
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
