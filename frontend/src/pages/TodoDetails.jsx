import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CalendarClock, CheckCircle2, Pencil, Trash2, Sparkles, Loader2, ListTodo } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import PriorityBadge from '../components/PriorityBadge';
import StatusBadge from '../components/StatusBadge';
import { deleteTodo, fetchTodoById, updateTodo, generateSubtasksWithAI } from '../services/todoService';
import { formatDate, formatDateTime, isOverdue } from '../utils/formatters';

const TodoDetails = () => {
  const [searchParams] = useSearchParams();
  const todoId = searchParams.get('todoid');
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);

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
        setTodo(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Todo not found.');
        } else {
          setError(err.response?.data?.message || 'Failed to load todo.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadTodo();
  }, [todoId]);

  const handleToggleComplete = async () => {
    if (!todo) return;
    const nextStatus = todo.status === 'completed' ? 'pending' : 'completed';
    try {
      const response = await updateTodo(todo.id, { ...todo, status: nextStatus });
      setTodo(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update todo status.');
    }
  };

  const handleDelete = async () => {
    if (!todo) return;
    const confirmed = window.confirm('Are you sure you want to delete this todo?');
    if (!confirmed) return;

    try {
      await deleteTodo(todo.id);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete todo.');
    }
  };

  const handleGenerateSubtasks = async () => {
    setIsGeneratingSubtasks(true);
    try {
      const data = await generateSubtasksWithAI(todo.id);
      setSubtasks(data.subtasks || []);
    } catch (err) {
      alert('Failed to generate subtasks using AI.');
    } finally {
      setIsGeneratingSubtasks(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading todo details..." />;

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-xl font-semibold text-slate-900">{error}</p>
        <Link to="/" className="primary-btn mt-5 inline-flex">Back to dashboard</Link>
      </div>
    );
  }

  if (!todo) return null;

  const overdue = isOverdue(todo.due_date, todo.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="secondary-btn gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link to={`/edit?todoid=${todo.id}`} className="secondary-btn gap-2">
            <Pencil className="h-4 w-4" />
            Edit Todo
          </Link>
          <button type="button" onClick={handleToggleComplete} className="secondary-btn gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {todo.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
          </button>
          <button type="button" onClick={handleDelete} className="danger-btn gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Todo
          </button>
        </div>
      </div>

      <article className="card overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <PriorityBadge priority={todo.priority} />
            <StatusBadge status={todo.status} />
            {overdue && <span className="badge border border-red-200 bg-red-50 text-red-700">Overdue</span>}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">{todo.title}</h1>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-slate-600">{todo.description || 'No description provided.'}</p>
            
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-violet-700">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">AI Subtasks</h2>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateSubtasks}
                  disabled={isGeneratingSubtasks}
                  className="secondary-btn flex items-center gap-2 text-violet-700 hover:border-violet-300 hover:bg-violet-50"
                >
                  {isGeneratingSubtasks ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListTodo className="h-4 w-4" />}
                  {subtasks.length > 0 ? 'Regenerate' : 'Generate Subtasks'}
                </button>
              </div>

              {subtasks.length > 0 && (
                <ul className="space-y-2 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                  {subtasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-sm border border-violet-100">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{task}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
              <div className="mt-2"><StatusBadge status={todo.status} /></div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Priority</p>
              <div className="mt-2"><PriorityBadge priority={todo.priority} /></div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Due date</p>
              <p className="mt-2 flex items-center gap-2 text-slate-700"><CalendarClock className="h-4 w-4" /> {formatDate(todo.due_date)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Created</p>
              <p className="mt-2 text-slate-700">{formatDateTime(todo.created_at)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Updated</p>
              <p className="mt-2 text-slate-700">{formatDateTime(todo.updated_at)}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Completed</p>
              <p className="mt-2 text-slate-700">{todo.completed_at ? formatDateTime(todo.completed_at) : 'Not completed yet'}</p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
};

export default TodoDetails;
