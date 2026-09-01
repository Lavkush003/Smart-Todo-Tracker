import { useEffect, useState } from 'react';

const defaultForm = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
};

const suggestions = [
  { label: 'Deep work', title: 'Complete the highest-impact task before noon', priority: 'high' },
  { label: 'Follow up', title: 'Send a quick update to the team', priority: 'medium' },
  { label: 'Personal', title: 'Book time for exercise or reset', priority: 'low' },
  { label: 'Planning', title: 'Outline next steps for the project sprint', priority: 'medium' },
];

const TodoForm = ({ initialValues, onSubmit, isSubmitting, submitLabel = 'Save' }) => {
  const [formData, setFormData] = useState(initialValues || defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialValues || defaultForm);
  }, [initialValues]);

  const validate = () => {
    const nextErrors = {};

    if (!formData.title?.trim()) {
      nextErrors.title = 'Title is required.';
    } else if (formData.title.trim().length > 120) {
      nextErrors.title = 'Title must be 120 characters or less.';
    }

    if (formData.description && formData.description.length > 1000) {
      nextErrors.description = 'Description must be 1000 characters or less.';
    }

    if (formData.status && !['pending', 'in_progress', 'completed'].includes(formData.status)) {
      nextErrors.status = 'Please select a valid status.';
    }

    if (formData.priority && !['low', 'medium', 'high'].includes(formData.priority)) {
      nextErrors.priority = 'Please select a valid priority.';
    }

    if (formData.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(formData.due_date)) {
      nextErrors.due_date = 'Due date must be in YYYY-MM-DD format.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const applySuggestion = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      title: suggestion.title,
      priority: suggestion.priority,
    }));
    setErrors((prev) => ({ ...prev, title: '', priority: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      due_date: formData.due_date || null,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="smart-panel p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-violet-500">Smart composer</p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--text-strong)]">Plan the next win</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Smart task flow active
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-[var(--text)]">Quick prompts</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => applySuggestion(suggestion)}
              className="rounded-full border border-[var(--border)] bg-[var(--panel-alt)] px-3 py-2 text-xs font-semibold text-[var(--text)] transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="label" htmlFor="title">Task title *</label>
          <input id="title" name="title" value={formData.title} onChange={handleChange} className="input input-glow" placeholder="Write your task clearly and specifically" />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="description">Details</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="input" placeholder="Add clear context, links, or success notes" />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="input">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
        </div>

        <div>
          <label className="label" htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="due_date">Due date</label>
          <input id="due_date" name="due_date" type="date" value={formData.due_date || ''} onChange={handleChange} className="input" />
          {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
        <button type="button" className="secondary-btn" onClick={() => window.history.back()}>Cancel</button>
        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
