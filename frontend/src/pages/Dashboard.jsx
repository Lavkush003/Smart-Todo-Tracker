import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search, Plus, Loader2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import TodoCard from '../components/TodoCard';
import { deleteTodo, fetchTodos, updateTodo, fetchStats } from '../services/todoService';

const initialFilters = {
  search: '',
  status: '',
  priority: '',
  category: '',
  sort: 'created_at_desc',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const loadData = async () => {
    setLoading(true);
    try {
      const [todosData, statsData] = await Promise.all([
        fetchTodos(filters),
        fetchStats()
      ]);
      setTodos(todosData.data);
      setStats(statsData.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.status, filters.priority, filters.category, filters.sort]);

  // Handle search with simple debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadData();
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleComplete = async (todo) => {
    const nextStatus = todo.status === 'completed' ? 'todo' : 'completed';
    try {
      const response = await updateTodo(todo.id, { status: nextStatus });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? response.data : t)));
      loadData(); // refresh stats
    } catch (err) {
      alert('Failed to update task status.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      loadData(); // refresh stats
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Quick Stats */}
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-strong)]">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
          </h1>
          <p className="mt-2 text-[var(--text-muted)]">Here's a quick overview of your tasks for today.</p>
        </div>
        <button onClick={() => navigate('/create')} className="primary-btn shrink-0 gap-2 px-6 py-3 shadow-xl">
          <Plus className="h-5 w-5" />
          Add Task
        </button>
      </header>

      {/* Summary Metrics */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--text-muted)]">Total Tasks</p>
            <p className="mt-2 text-3xl font-bold text-[var(--text-strong)]">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm dark:border-blue-900/50 dark:bg-blue-900/20">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Pending</p>
            <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.pending}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-900/20">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-400">{stats.completed}</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 shadow-sm dark:border-red-900/50 dark:bg-red-900/20">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Overdue</p>
            <p className="mt-2 text-3xl font-bold text-red-700 dark:text-red-400">{stats.overdue}</p>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search tasks, descriptions, or tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input pl-10 h-11"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] hidden sm:flex">
              <Filter className="h-4 w-4" /> Filters
            </div>

            <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="input h-11 py-0 sm:w-36">
              <option value="">All Statuses</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>

            <select value={filters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)} className="input h-11 py-0 sm:w-36">
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className="input h-11 py-0 sm:w-36">
              <option value="">All Categories</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Study">Study</option>
              <option value="Health">Health</option>
              <option value="Projects">Projects</option>
              <option value="Other">Other</option>
            </select>
            
            <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="input h-11 py-0 sm:w-44 border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-900/30 dark:text-violet-200">
              <option value="created_at_desc">Newest First</option>
              <option value="created_at_asc">Oldest First</option>
              <option value="due_date_asc">Due Date (Earliest)</option>
              <option value="due_date_desc">Due Date (Latest)</option>
              <option value="priority_desc">Priority (Urgent First)</option>
              <option value="priority_asc">Priority (Low First)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        ) : todos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onDelete={handleDelete}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tasks found"
            description="Adjust your filters or create a new task to get started."
            actionLabel="Create Task"
            onAction={() => navigate('/create')}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
