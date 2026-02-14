import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const navigate = useNavigate();

  const checkAdminAndNavigate = async (userId: string) => {
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (!roles?.some((r: { role: string }) => r.role === 'admin')) {
      setError('Доступ запрещён. Требуется роль администратора.');
      await supabase.auth.signOut();
      return false;
    }
    navigate('/admin');
    return true;
  };

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

    await checkAdminAndNavigate(data.user.id);
    setLoading(false);
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    setError('');
    const { error: oauthError } = await lovable.auth.signInWithOAuth('apple', {
      redirect_uri: window.location.origin,
    });
    if (oauthError) {
      setError(oauthError.message || 'Ошибка входа через Apple');
      setAppleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">subday</h1>
          <p className="text-sm text-muted-foreground">Панель администратора</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input-field"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="input-field"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-dark w-full justify-center"
          >
            {loading && <Loader2 size={16} className="mr-2 animate-spin" />}
            Войти
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground">или</span>
          </div>
        </div>

        <button
          onClick={handleAppleSignIn}
          disabled={appleLoading}
          className="btn-dark w-full justify-center gap-2"
        >
          {appleLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
          )}
          Войти через Apple
        </button>
      </div>
    </div>
  );
}
