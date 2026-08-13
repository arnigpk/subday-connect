import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

function safeNext(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith('/') || value.startsWith('//')) return null;
  return value;
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get('next'));

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        if (next) {
          window.location.href = next;
          return;
        }
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
        if (roles?.some((r: { role: string }) => r.role === 'admin')) {
          navigate('/admin', { replace: true });
          return;
        }
      }
      setChecking(false);
    });
  }, [navigate, next]);

  if (checking) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Authentication failed');
      setLoading(false);
      return;
    }

    if (next) {
      window.location.href = next;
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id);

    if (!roles?.some((r: { role: string }) => r.role === 'admin')) {
      setError('Доступ запрещён. Требуется роль администратора.');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(220,13%,8%)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">subday</h1>
          <p className="text-[13px] text-[hsl(220,10%,45%)]">Панель администратора</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] p-3 rounded-xl">
              {error}
            </div>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="admin-input"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="admin-input"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold-dark))] transition-all"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
