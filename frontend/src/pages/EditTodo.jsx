import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TodoForm from '../components/TodoForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchTodoById, updateTodo } from '../services/todoService';

const EditTodo = () => {
  const [searchParams] = useSearchParams();
  const todoId = searchParams.get('id') || searchParams.get('todoid');
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTodo = async () => {
      if (!todoId) {
        setError('Task ID is required.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetchTodoById(Number(todoId));
        setTodo(response.data);
      } catch (err) {
        setError('Failed to load task for editing.');
      } finally {
        setLoading(false);
      }
    };
    loadTodo();
  }, [todoId]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await updateTodo(todo.id, payload);
      navigate(`/todo?id=${todo.id}`);
    } catch (err) {
      alert('Failed to update task.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="secondary-btn gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
      
      <header className="rounded-[2rem] bg-[var(--panel-alt)] p-6 border border-[var(--border)] sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-500">Edit Task</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--text-strong)]">{todo.title}</h1>
          </div>
        </div>
      </header>

      <TodoForm initialValues={todo} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Save Changes" />
    </div>
  );
};

export default EditTodo;
