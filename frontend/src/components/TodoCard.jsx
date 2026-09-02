import { CalendarDays, CheckCheck, Eye, Pencil, Trash2, Folder, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, isOverdue } from '../utils/formatters';

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

const TodoCard = ({ todo, onDelete, onToggleComplete }) => {
  const overdue = isOverdue(todo.due_date, todo.status);
  const isCompleted = todo.status === 'completed';

  return (
    <article className={`card p-5 transition duration-200 hover:-translate-y-1 hover:shadow-xl ${isCompleted ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityColors[todo.priority] || priorityColors.medium}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[todo.status] || statusColors.todo}`}>
              {todo.status.replace('_', ' ').charAt(0).toUpperCase() + todo.status.replace('_', ' ').slice(1)}
            </span>
            {overdue && <span className="badge border border-red-200 bg-red-50 text-red-700">Overdue</span>}
          </div>
          <h3 className={`text-xl font-semibold text-[var(--text-strong)] ${isCompleted ? 'line-through decoration-slate-400' : ''}`}>
            {todo.title}
          </h3>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-[var(--text-muted)]">{todo.description || 'No description provided.'}</p>

      <div className="mt-4 grid gap-2 text-xs font-medium text-[var(--text-muted)] sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Due: {formatDate(todo.due_date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4" />
          <span>{todo.category}</span>
        </div>
        {todo.estimated_time && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{todo.estimated_time}</span>
          </div>
        )}
      </div>

      {todo.tags && todo.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {todo.tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-4">
        <div className="flex gap-2">
          <Link to={`/todo?id=${todo.id}`} className="secondary-btn gap-2 px-3 py-1.5 text-xs">
            <Eye className="h-3 w-3" />
            View
          </Link>
          <Link to={`/edit?id=${todo.id}`} className="secondary-btn gap-2 px-3 py-1.5 text-xs">
            <Pencil className="h-3 w-3" />
            Edit
          </Link>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onToggleComplete(todo)} className={`secondary-btn gap-2 px-3 py-1.5 text-xs ${isCompleted ? '' : 'text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50'}`}>
            <CheckCheck className="h-3 w-3" />
            {isCompleted ? 'Mark Todo' : 'Complete'}
          </button>
          <button type="button" onClick={() => onDelete(todo.id)} className="danger-btn gap-2 px-3 py-1.5 text-xs">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default TodoCard;
