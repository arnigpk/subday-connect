import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AuthorizationDetails {
  client?: { name?: string };
  redirect_url?: string;
  redirect_to?: string;
}

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Отсутствует authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/admin/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: detailsError } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const api = oauth();
    const { data, error: decideError } = approve
      ? await api.approveAuthorization(authorizationId)
      : await api.denyAuthorization(authorizationId);
    if (decideError) {
      setBusy(false);
      setError(decideError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Сервер авторизации не вернул адрес перенаправления.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "приложение";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(220,13%,8%)] px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">subday</h1>
        <p className="text-[13px] text-[hsl(220,10%,45%)] mb-8">Доступ приложения</p>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] p-3 rounded-xl">
            Не удалось обработать запрос: {error}
          </div>
        ) : !details ? (
          <div className="flex items-center justify-center gap-2 text-[hsl(220,10%,45%)] text-[13px]">
            <Loader2 size={16} className="animate-spin" /> Загрузка…
          </div>
        ) : (
          <div className="space-y-5">
            <div className="bg-[hsl(220,10%,11%)] border border-[hsl(220,10%,18%)] rounded-2xl p-5 text-left">
              <h2 className="text-[15px] font-semibold text-white mb-1">Подключить «{clientName}»</h2>
              <p className="text-[13px] text-[hsl(220,10%,55%)]">
                Приложение сможет работать с данными портала партнёров subday от вашего имени.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={busy}
                onClick={() => decide(true)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold-dark))] transition-all"
              >
                {busy && <Loader2 size={14} className="animate-spin" />} Разрешить
              </button>
              <button
                disabled={busy}
                onClick={() => decide(false)}
                className="flex-1 py-3 rounded-xl text-[14px] font-medium bg-[hsl(220,10%,14%)] border border-[hsl(220,10%,20%)] text-[hsl(220,10%,65%)] hover:text-white transition-all"
              >
                Отклонить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
