import { CalendarDays, CheckCheck, Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, isOverdue } from '../utils/formatters';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const TodoCard = ({ todo, onDelete, onToggleComplete }) => {
  const overdue = isOverdue(todo.due_date, todo.status);

  return (
    <article className="card p-5 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={todo.priority} />
            <StatusBadge status={todo.status} />
            {overdue && <span className="badge border border-red-200 bg-red-50 text-red-700">Overdue</span>}
          </div>
          <h3 className="text-xl font-semibold text-[var(--text-strong)]">{todo.title}</h3>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-[var(--text-muted)]">{todo.description || 'No description provided.'}</p>

      <div className="mt-4 grid gap-3 text-sm text-[var(--text-muted)] sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Due: {formatDate(todo.due_date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span>Created: {formatDate(todo.created_at)}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link to={`/todo?todoid=${todo.id}`} className="secondary-btn gap-2">
          <Eye className="h-4 w-4" />
          View
        </Link>
        <Link to={`/edit?todoid=${todo.id}`} className="secondary-btn gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
        {todo.status !== 'completed' ? (
          <button type="button" onClick={() => onToggleComplete(todo)} className="secondary-btn gap-2">
            <CheckCheck className="h-4 w-4" />
            Complete
          </button>
        ) : (
          <button type="button" onClick={() => onToggleComplete(todo)} className="secondary-btn gap-2">
            <CheckCheck className="h-4 w-4" />
            Pending
          </button>
        )}
        <button type="button" onClick={() => onDelete(todo.id)} className="danger-btn gap-2">
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  );
};

export default TodoCard;
