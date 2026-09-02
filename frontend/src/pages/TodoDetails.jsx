import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarClock, CheckCircle2, Pencil, Trash2, Sparkles, Loader2, Folder, Clock, Tag } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { deleteTodo, fetchTodoById, updateTodo, sendChatMessage } from '../services/todoService';
import { formatDate, formatDateTime, isOverdue } from '../utils/formatters';

const priorityColors = {
  urgent: 'border-red-200 bg-red-100 text-red-700',
  high: 'border-orange-200 bg-orange-100 text-orange-700',
  medium: 'border-blue-200 bg-blue-100 text-blue-700',
  low: 'border-slate-200 bg-slate-100 text-slate-700',
};

const statusColors = {
  todo: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-zinc-100 text-zinc-600',
};

const TodoDetails = () => {
  const [searchParams] = useSearchParams();
  // Support both todoid and id for backward compatibility
  const todoId = searchParams.get('id') || searchParams.get('todoid');
  const navigate = useNavigate();
  
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadTodo = async () => {
      setLoading(true);
      setError('');

      if (!todoId || Number.isNaN(Number(todoId)) || Number(todoId) <= 0) {
        setError('Todo ID is required.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchTodoById(Number(todoId));
        if (!response.data) throw new Error('Todo not found');
        setTodo(response.data);
      } catch (err) {
        setError('Failed to load todo.');
      } finally {
        setLoading(false);
      }
    };

    loadTodo();
  }, [todoId]);

  const handleToggleComplete = async () => {
    if (!todo) return;
    const nextStatus = todo.status === 'completed' ? 'todo' : 'completed';
    try {
      const response = await updateTodo(todo.id, { status: nextStatus });
      setTodo(response.data);
    } catch (err) {
      setError('Failed to update todo status.');
    }
  };

  const handleDelete = async () => {
    if (!todo) return;
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      await deleteTodo(todo.id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  const handleGenerateSuggestion = async () => {
    setIsGenerating(true);
    try {
      const responseData = await sendChatMessage(`Analyze this task and give me a suggested next action, priority, and estimated difficulty for: ${todo.title}. Description: ${todo.description}`);
      setAiSuggestion(responseData.data.reply);
    } catch (err) {
      alert('Failed to get AI suggestions.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading task details..." />;

  if (error || !todo) {
    return (
      <div className="card p-8 text-center">
        <p className="text-xl font-semibold text-[var(--text-strong)]">{error || 'Task not found'}</p>
        <Link to="/" className="primary-btn mt-5 inline-flex">Back to dashboard</Link>
      </div>
    );
  }

  const overdue = isOverdue(todo.due_date, todo.status);
  const isCompleted = todo.status === 'completed';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => navigate(-1)} className="secondary-btn gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex flex-wrap gap-2">
          <Link to={`/edit?id=${todo.id}`} className="secondary-btn gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
          <button type="button" onClick={handleToggleComplete} className="secondary-btn gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {isCompleted ? 'Mark Pending' : 'Mark Complete'}
          </button>
          <button type="button" onClick={handleDelete} className="danger-btn gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <article className="card overflow-hidden">
        <div className="border-b border-[var(--border)] bg-[var(--panel-alt)] p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityColors[todo.priority] || priorityColors.medium}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[todo.status] || statusColors.todo}`}>
              {todo.status.replace('_', ' ').charAt(0).toUpperCase() + todo.status.replace('_', ' ').slice(1)}
            </span>
            {overdue && <span className="badge border border-red-200 bg-red-50 text-red-700">Overdue</span>}
          </div>
          <h1 className={`mt-4 text-3xl font-bold text-[var(--text-strong)] ${isCompleted ? 'line-through opacity-70' : ''}`}>{todo.title}</h1>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section>
            <h2 className="text-lg font-semibold text-[var(--text-strong)]">Details</h2>
            <p className="mt-3 whitespace-pre-wrap text-[var(--text)]">{todo.description || 'No description provided.'}</p>
            
            {todo.notes && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
                <h3 className="font-semibold text-amber-800 dark:text-amber-400">Notes</h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300 whitespace-pre-wrap">{todo.notes}</p>
              </div>
            )}
            
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Taskora AI Suggestions</h2>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateSuggestion}
                  disabled={isGenerating}
                  className="secondary-btn flex items-center gap-2 text-violet-700 hover:border-violet-300 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/30"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {aiSuggestion ? 'Regenerate' : 'Analyze Task'}
                </button>
              </div>

              {aiSuggestion && (
                <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 text-[15px] leading-relaxed text-violet-900 dark:border-violet-900/50 dark:bg-violet-900/20 dark:text-violet-100">
                  <div className="whitespace-pre-wrap">{aiSuggestion}</div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel-alt)] p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Category</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[var(--text-strong)]">
                <Folder className="h-4 w-4" /> {todo.category}
              </p>
            </div>

            {todo.estimated_time && (
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Estimated Time</p>
                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[var(--text-strong)]">
                  <Clock className="h-4 w-4" /> {todo.estimated_time}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Due date</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[var(--text-strong)]">
                <CalendarClock className="h-4 w-4" /> {formatDate(todo.due_date)}
              </p>
            </div>
            
            {todo.tags && todo.tags.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)] mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {todo.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      <Tag className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-[var(--border)] pt-4 mt-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Created</p>
              <p className="mt-1 text-xs text-[var(--text)]">{formatDateTime(todo.created_at)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Updated</p>
              <p className="mt-1 text-xs text-[var(--text)]">{formatDateTime(todo.updated_at)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Completed</p>
              <p className="mt-1 text-xs text-[var(--text)]">{todo.completed_at ? formatDateTime(todo.completed_at) : '—'}</p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
};

export default TodoDetails;
