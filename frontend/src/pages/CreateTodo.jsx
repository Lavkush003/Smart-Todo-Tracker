import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import TodoForm from '../components/TodoForm';
import { createTodo } from '../services/todoService';

const CreateTodo = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await createTodo(payload);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="secondary-btn gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
      
      <header className="rounded-[2rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 p-6 text-white shadow-xl shadow-violet-500/20 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-100">New Taskora</p>
            <h1 className="mt-2 text-3xl font-bold">Capture the next important move</h1>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            Focus on impact
          </div>
        </div>
      </header>

      <TodoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Task" />
    </div>
  );
};

export default CreateTodo;
