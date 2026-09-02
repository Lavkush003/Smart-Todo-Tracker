import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, BarChart3, Settings, Bot, Plus, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('ziptrip-theme') || 'light');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ziptrip-theme', theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/assistant', label: 'Taskora AI', icon: MessageSquare },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/create', label: 'New Task', icon: Plus },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg)] font-sans text-[var(--text)] transition-colors duration-200">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--panel-alt)] shadow-lg transition-transform md:translate-x-0">
        <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[var(--text-strong)]">Taskora</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-100 text-violet-700 shadow-sm dark:bg-violet-900/30 dark:text-violet-400'
                    : 'text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--border)] p-4 space-y-2">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] transition-all hover:bg-[var(--hover)] hover:text-[var(--text)]"
          >
            <Settings className="h-5 w-5" />
            Toggle Theme
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 transition-all md:ml-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--panel)]/80 px-6 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-[var(--text-strong)]">Workspace</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[var(--text-muted)] hidden sm:block">
              {user?.name || 'User'}
            </span>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-[var(--border)] bg-slate-200">
              <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`} alt="User" />
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-8">
          <Outlet />
        </div>
      </main>

      {/* Floating Assistant Button for mobile/global */}
      <Link
        to="/assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/30 transition-transform hover:scale-105 active:scale-95"
      >
        <MessageSquare className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default MainLayout;
