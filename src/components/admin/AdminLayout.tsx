import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard, Users, Image, Settings, LogOut, Menu, X, ExternalLink } from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Редактор', icon: LayoutDashboard },
  { path: '/admin/leads', label: 'Заявки', icon: Users },
  { path: '/admin/media', label: 'Медиа', icon: Image },
  { path: '/admin/settings', label: 'Настройки', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAdmin();
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-theme min-h-screen bg-[hsl(220,13%,8%)] text-[hsl(220,10%,90%)]">
      {/* Left sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[hsl(220,13%,10%)] border-r border-[hsl(220,10%,16%)] z-40
        flex flex-col transition-transform lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="h-14 flex items-center px-5 border-b border-[hsl(220,10%,16%)]">
          <Link to="/admin" className="font-extrabold text-sm tracking-wide text-white">
            subday <span className="text-[hsl(var(--gold))] font-normal text-xs ml-1">admin</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  active
                    ? 'bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold))]'
                    : 'text-[hsl(220,10%,55%)] hover:text-[hsl(220,10%,80%)] hover:bg-[hsl(220,10%,14%)]'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[hsl(220,10%,16%)] space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[hsl(220,10%,55%)] hover:text-[hsl(220,10%,80%)] hover:bg-[hsl(220,10%,14%)] transition-all"
          >
            <ExternalLink size={14} />
            Открыть сайт
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[hsl(220,10%,55%)] hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={14} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-60 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-[hsl(220,13%,10%)]/80 backdrop-blur-xl border-b border-[hsl(220,10%,16%)] flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-[hsl(220,10%,14%)] transition-colors" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ru' ? 'kz' : 'ru')}
              className="text-xs font-bold uppercase px-3 py-1.5 rounded-lg border border-[hsl(220,10%,20%)] hover:border-[hsl(var(--gold)/0.5)] hover:text-[hsl(var(--gold))] transition-all text-[hsl(220,10%,55%)]"
            >
              {lang === 'ru' ? '🇰🇿 KZ' : '🇷🇺 RU'}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
