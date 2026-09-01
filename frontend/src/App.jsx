import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Info, Plus, Moon, Sun, Sparkles } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import TodoDetails from './pages/TodoDetails';
import CreateTodo from './pages/CreateTodo';
import EditTodo from './pages/EditTodo';
import About from './pages/About';
import NotFound from './pages/NotFound';
import SmartInsightWidget from './components/SmartInsightWidget';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/create', label: 'New Task', icon: Plus },
  { to: '/about', label: 'About', icon: Info },
];

const App = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('ziptrip-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ziptrip-theme', theme);
  }, [theme]);

  return (
    <div className="smart-app-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="smart-surface flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-[2rem] border">
          <header className="smart-header border-b px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-500">SmartFlow</p>
                  <h1 className="text-lg font-bold text-[var(--text-strong)]">Task cockpit</h1>
                </div>
              </Link>

              <div className="flex items-center justify-between gap-2 xl:justify-end">
                <button
                  type="button"
                  onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                  className="secondary-btn gap-2 px-3 py-2"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>

                <nav className="hidden items-center gap-2 sm:flex">
                  {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                          isActive ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20' : 'text-[var(--text-muted)] hover:bg-[var(--hover)]'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col lg:flex-row">
            <aside className="smart-sidebar w-full border-b p-4 lg:w-72 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[var(--text-muted)]">Workspace</p>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">Live</span>
              </div>

              <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-x-visible">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                        isActive ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20' : 'text-[var(--text)] hover:bg-[var(--hover)]'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </NavLink>
                ))}
              </nav>

              <SmartInsightWidget />
            </aside>

            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/todo" element={<TodoDetails />} />
                <Route path="/create" element={<CreateTodo />} />
                <Route path="/edit" element={<EditTodo />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
