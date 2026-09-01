import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TodoForm from '../components/TodoForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchTodoById, updateTodo } from '../services/todoService';

const EditTodo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const todoId = searchParams.get('todoid');
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setInitialValues({
          title: response.data.title,
          description: response.data.description || '',
          status: response.data.status,
          priority: response.data.priority,
          due_date: response.data.due_date || '',
        });
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

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await updateTodo(Number(todoId), payload);
      navigate(`/todo?todoid=${todoId}`);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update todo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading todo..." />;

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-xl font-semibold text-[var(--text-strong)]">{error}</p>
        <button type="button" className="primary-btn mt-5" onClick={() => navigate('/')}>Back to dashboard</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-violet-200 bg-gradient-to-r from-amber-400/20 via-violet-500/10 to-cyan-500/20 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-600">Update task</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--text-strong)]">Refine your plan</h1>
      </header>

      <TodoForm initialValues={initialValues} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Changes" />
    </div>
  );
};

export default EditTodo;
