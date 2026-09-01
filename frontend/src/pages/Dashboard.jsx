import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Filter,
  ListTodo,
  Plus,
  Search,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import TodoCard from '../components/TodoCard';
import { deleteTodo, fetchTodos, updateTodo } from '../services/todoService';
import { formatDate, isOverdue } from '../utils/formatters';

const initialFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  sort: 'created_at_desc',
};

const graphOptions = ['day', 'week', 'month'];

const getRangeLabel = (date, mode) => {
  if (mode === 'day') return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (mode === 'week') return `W${Math.ceil((date.getDate() + (date.getDay() || 7)) / 7)}`;
  return date.toLocaleDateString(undefined, { month: 'short' });
};

const getGraphSeries = (todos, mode) => {
  const now = new Date();
  const isDay = mode === 'day';
  const isWeek = mode === 'week';

  const buckets = [];
  const totalBuckets = isDay ? 7 : isWeek ? 8 : 6;

  for (let index = totalBuckets - 1; index >= 0; index -= 1) {
    let from;
    let to;

    if (isDay) {
      from = new Date(now);
      from.setHours(0, 0, 0, 0);
      from.setDate(now.getDate() - index);
      to = new Date(from);
      to.setHours(23, 59, 59, 999);
    } else if (isWeek) {
      const current = new Date(now);
      current.setHours(0, 0, 0, 0);
      const day = current.getDay() || 7;
      current.setDate(current.getDate() - day + 1);
      from = new Date(current);
      from.setDate(current.getDate() - (index * 7));
      to = new Date(from);
      to.setDate(from.getDate() + 6);
      to.setHours(23, 59, 59, 999);
    } else {
      from = new Date(now.getFullYear(), now.getMonth() - index, 1);
      to = new Date(now.getFullYear(), now.getMonth() - index + 1, 0, 23, 59, 59, 999);
    }

    const tasksInBucket = todos.filter((todo) => {
      const dueDate = new Date(todo.due_date || todo.created_at);
      return dueDate >= from && dueDate <= to;
    });

    const completed = tasksInBucket.filter((todo) => todo.status === 'completed').length;
    const pending = tasksInBucket.filter((todo) => todo.status !== 'completed').length;

    buckets.push({
      label: getRangeLabel(from, mode),
      total: tasksInBucket.length,
      completed,
      pending,
      from,
      to,
    });
  }

  const currentTotal = buckets[buckets.length - 1]?.total || 0;
  const previousTotal = buckets.length > 1 ? buckets[buckets.length - 2]?.total || 0 : 0;

  return {
    buckets,
    comparison: currentTotal - previousTotal,
    average: buckets.reduce((sum, bucket) => sum + bucket.total, 0) / buckets.length,
  };
};

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [graphMode, setGraphMode] = useState('week');
  const [notificationPermission, setNotificationPermission] = useState('default');
  const lastAlertedKey = useRef('');
  const navigate = useNavigate();

  const loadTodos = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchTodos({
        search: filters.search,
        status: filters.status === 'all' ? '' : filters.status,
        priority: filters.priority === 'all' ? '' : filters.priority,
        sort: filters.sort,
      });
      setTodos(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load todos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filters.search, filters.status, filters.priority, filters.sort]);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.status === 'completed').length;
    const pending = todos.filter((todo) => todo.status === 'pending').length;
    const inProgress = todos.filter((todo) => todo.status === 'in_progress').length;
    const overdue = todos.filter((todo) => isOverdue(todo.due_date, todo.status)).length;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, pending, inProgress, overdue, completionRate };
  }, [todos]);

  const focusTasks = useMemo(() => {
    return [...todos]
      .sort((a, b) => {
        const dateA = new Date(a.due_date || '9999-12-31');
        const dateB = new Date(b.due_date || '9999-12-31');
        return dateA - dateB;
      })
      .slice(0, 4);
  }, [todos]);

  const reminders = useMemo(() => {
    return [...todos]
      .filter((todo) => todo.status !== 'completed')
      .filter((todo) => {
        if (!todo.due_date) return false;
        const dueDate = new Date(todo.due_date);
        const soonThreshold = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
        return dueDate <= soonThreshold || isOverdue(todo.due_date, todo.status);
      })
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 4);
  }, [todos]);

  const graph = useMemo(() => getGraphSeries(todos, graphMode), [todos, graphMode]);
  const maxGraphValue = Math.max(...graph.buckets.map((bucket) => bucket.total), 1);

  useEffect(() => {
    if (reminders.length === 0) return;

    const message = reminders
      .slice(0, 3)
      .map((todo) => `${todo.title} (${todo.priority})`)
      .join(', ');

    const key = `${reminders[0].id}-${reminders[0].due_date}`;

    if (lastAlertedKey.current === key) return;
    lastAlertedKey.current = key;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task reminder', {
        body: `You have ${reminders.length} task(s) pending or overdue: ${message}`,
      });
    }
  }, [reminders]);

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      setError('This browser does not support desktop notifications.');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === 'granted' && reminders.length > 0) {
      new Notification('Task reminder enabled', {
        body: `You currently have ${reminders.length} task(s) to review.`,
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this todo?');
    if (!confirmed) return;

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete todo.');
    }
  };

  const handleToggleComplete = async (todo) => {
    const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
    try {
      const response = await updateTodo(todo.id, { ...todo, status: nextStatus });
      setTodos((prev) => prev.map((item) => (item.id === todo.id ? response.data : item)));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update todo status.');
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="space-y-6">
      <header className="card p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Good morning 👋</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--text-strong)]">Stay organized and get things done.</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="secondary-btn gap-2" onClick={enableNotifications}>
              <BellRing className="h-4 w-4" />
              {notificationPermission === 'granted' ? 'Alerts enabled' : 'Enable alerts'}
            </button>
            <button type="button" className="primary-btn gap-2" onClick={() => navigate('/create')}>
              <Plus className="h-4 w-4" />
              Add Todo
            </button>
          </div>
        </div>
      </header>

      {reminders.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-amber-200 p-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em]">Task alert</p>
                <p className="mt-1 text-sm">
                  You have {reminders.length} task(s) pending or due soon. Focus on the most urgent ones before they get missed.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {reminders.map((todo) => (
                <span key={todo.id} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200">
                  {todo.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Tasks" value={stats.total} icon={<ListTodo className="h-5 w-5" />} accent="bg-blue-100 text-blue-700" />
        <StatCard label="Pending" value={stats.pending} icon={<CircleDashed className="h-5 w-5" />} accent="bg-amber-100 text-amber-700" />
        <StatCard label="In Progress" value={stats.inProgress} icon={<CalendarClock className="h-5 w-5" />} accent="bg-indigo-100 text-indigo-700" />
        <StatCard label="Completed" value={stats.completed} icon={<CheckCircle2 className="h-5 w-5" />} accent="bg-emerald-100 text-emerald-700" />
        <StatCard label="Overdue" value={stats.overdue} icon={<ShieldAlert className="h-5 w-5" />} accent="bg-red-100 text-red-700" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Task tracking</p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--text-strong)]">Progress overview</h2>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {stats.completionRate}% complete
            </span>
          </div>
          <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted-soft)]">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: `${stats.completionRate}%` }} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniMetric label="Completed" value={stats.completed} tone="emerald" />
            <MiniMetric label="Active" value={stats.inProgress} tone="blue" />
            <MiniMetric label="Pending" value={stats.pending} tone="amber" />
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Focus list</p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--text-strong)]">Up next</h2>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
          </div>

          <div className="space-y-3">
            {focusTasks.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No tasks tracked yet.</p>
            ) : (
              focusTasks.map((todo) => (
                <div key={todo.id} className="rounded-2xl border border-[var(--border)] bg-[var(--panel-alt)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--text-strong)]">{todo.title}</p>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                      {todo.priority}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>{todo.status.replace('_', ' ')}</span>
                    <span>{formatDate(todo.due_date)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="card p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Analytics</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--text-strong)]">Task graph</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel-alt)] p-1">
            {graphOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setGraphMode(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  graphMode === option ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-alt)] p-4">
            <div className="flex h-44 items-end gap-3">
              {graph.buckets.map((bucket) => {
                const height = `${(bucket.total / maxGraphValue) * 100}%`;
                return (
                  <div key={`${bucket.label}-${bucket.from}`} className="flex flex-1 flex-col items-center justify-end gap-2">
                    <div className="flex h-full w-full items-end justify-center rounded-t-2xl bg-[var(--muted-soft)] p-1">
                      <div
                        className="w-full rounded-t-xl bg-gradient-to-t from-blue-500 to-emerald-400"
                        style={{ height }}
                        title={`${bucket.total} tasks`}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-[var(--text-muted)]">{bucket.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-alt)] p-4">
              <div className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">Performance</p>
              </div>
              <p className="mt-3 text-2xl font-bold text-[var(--text-strong)]">{graph.comparison >= 0 ? '+' : ''}{graph.comparison}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">vs previous period</p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-alt)] p-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <BarChart3 className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em]">Average</p>
              </div>
              <p className="mt-3 text-2xl font-bold text-[var(--text-strong)]">{graph.average.toFixed(1)}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">avg tasks per {graphMode}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel-alt)] px-3 py-2.5">
            <Search className="h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search todos..."
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              className="w-full border-0 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[48rem]">
            <label className="text-sm font-medium text-[var(--text)]">
              <span className="mb-1 flex items-center gap-2"><Filter className="h-4 w-4" /> Status</span>
              <select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))} className="input">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label className="text-sm font-medium text-[var(--text)]">
              <span className="mb-1 flex items-center gap-2"><Filter className="h-4 w-4" /> Priority</span>
              <select value={filters.priority} onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))} className="input">
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="text-sm font-medium text-[var(--text)]">
              <span className="mb-1 flex items-center gap-2"><Filter className="h-4 w-4" /> Sort</span>
              <select value={filters.sort} onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))} className="input">
                <option value="created_at_desc">Newest</option>
                <option value="created_at_asc">Oldest</option>
                <option value="due_date_asc">Due soonest</option>
                <option value="due_date_desc">Due latest</option>
                <option value="priority_high">Priority: High</option>
                <option value="priority_low">Priority: Low</option>
              </select>
            </label>
          </div>
        </div>

        {(filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.sort !== 'created_at_desc') && (
          <div className="mt-4 flex justify-end">
            <button type="button" className="secondary-btn" onClick={resetFilters}>Clear filters</button>
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading tasks..." />
      ) : todos.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          message="Create your first task and start organizing your work."
          actionLabel="Create a todo"
          onAction={() => navigate('/create')}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {todos.map((todo) => (
            <TodoCard key={todo.id} todo={todo} onDelete={handleDelete} onToggleComplete={handleToggleComplete} />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, accent }) => (
  <div className="card p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
        <p className="mt-2 text-2xl font-bold text-[var(--text-strong)]">{value}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>{icon}</div>
    </div>
  </div>
);

const MiniMetric = ({ label, value, tone }) => {
  const toneMap = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-alt)] p-3">
      <div className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${toneMap[tone]}`}>
        {label}
      </div>
      <p className="mt-3 text-2xl font-bold text-[var(--text-strong)]">{value}</p>
    </div>
  );
};

export default Dashboard;
