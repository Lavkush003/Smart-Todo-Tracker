import { useEffect, useState } from 'react';

const defaultForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: 'Other',
  tags: '', // string for input, array for api
  due_date: '',
  estimated_time: '',
  notes: '',
};

const suggestions = [
  { label: 'Deep work', title: 'Complete the highest-impact task before noon', priority: 'urgent', category: 'Work' },
  { label: 'Follow up', title: 'Send a quick update to the team', priority: 'medium', category: 'Work' },
  { label: 'Personal', title: 'Book time for exercise or reset', priority: 'low', category: 'Personal' },
];

const categories = ['Work', 'Personal', 'Study', 'Health', 'Projects', 'Other'];

const TodoForm = ({ initialValues, onSubmit, isSubmitting, submitLabel = 'Save' }) => {
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...defaultForm,
        ...initialValues,
        tags: Array.isArray(initialValues.tags) ? initialValues.tags.join(', ') : initialValues.tags || '',
      });
    }
  }, [initialValues]);

  const validate = () => {
    const nextErrors = {};
    if (!formData.title?.trim()) {
      nextErrors.title = 'Title is required.';
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
      category: suggestion.category,
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
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      due_date: formData.due_date || null,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="smart-panel p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-violet-500">Taskora Builder</p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--text-strong)]">Plan your next move</h2>
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
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} className="input" placeholder="Add clear context, links, or success notes" />
        </div>

        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="input">
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="input">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="tags">Tags (comma separated)</label>
          <input id="tags" name="tags" value={formData.tags} onChange={handleChange} className="input" placeholder="e.g. #urgent, #project" />
        </div>

        <div>
          <label className="label" htmlFor="estimated_time">Estimated Time</label>
          <input id="estimated_time" name="estimated_time" value={formData.estimated_time} onChange={handleChange} className="input" placeholder="e.g. 2 hours" />
        </div>

        <div>
          <label className="label" htmlFor="due_date">Due date</label>
          <input id="due_date" name="due_date" type="date" value={formData.due_date || ''} onChange={handleChange} className="input" />
          {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={2} className="input" placeholder="Any additional notes..." />
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
