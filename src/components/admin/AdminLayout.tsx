import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard, Users, Image, Settings, LogOut, Menu, X } from 'lucide-react';

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
    <div className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <header className="h-14 bg-background border-b border-border flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-1" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/admin" className="font-extrabold text-sm">subday admin</Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === 'ru' ? 'kz' : 'ru')}
            className="text-xs font-semibold uppercase px-2 py-1 rounded border border-border hover:bg-accent transition-colors"
          >
            {lang === 'ru' ? 'KZ' : 'RU'}
          </button>
          <a href="/" target="_blank" className="text-xs text-muted-foreground hover:text-foreground px-2">
            Сайт ↗
          </a>
          <button onClick={signOut} className="p-1.5 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-56 bg-background border-r border-border z-30
          transition-transform lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-foreground/20 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
