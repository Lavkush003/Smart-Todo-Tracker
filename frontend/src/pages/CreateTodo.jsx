import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import TodoForm from '../components/TodoForm';
import { createTodo, parseTaskWithAI } from '../services/todoService';

const CreateTodo = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smartInput, setSmartInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      await createTodo(payload);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to create todo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSmartParse = async () => {
    if (!smartInput.trim()) return;
    setIsParsing(true);
    try {
      const result = await parseTaskWithAI(smartInput);
      setInitialData((prev) => ({ ...prev, ...result }));
      setSmartInput('');
    } catch (err) {
      console.error(err);
      alert('Failed to parse task intelligently.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 p-6 text-white shadow-xl shadow-violet-500/20 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-100">New task</p>
            <h1 className="mt-2 text-3xl font-bold">Capture the next important move</h1>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            Focus on impact
          </div>
        </div>
      </header>

      <div className="rounded-[2rem] border border-violet-200 bg-white/60 p-6 shadow-xl backdrop-blur-md dark:border-violet-900/50 dark:bg-slate-900/60">
        <div className="mb-4 flex items-center gap-2 text-violet-700 dark:text-violet-400">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Magic Extract</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            className="input input-glow flex-1"
            placeholder="e.g., Remind me to buy groceries tomorrow at high priority"
            value={smartInput}
            onChange={(e) => setSmartInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSmartParse()}
          />
          <button
            onClick={handleSmartParse}
            disabled={isParsing || !smartInput.trim()}
            className="primary-btn whitespace-nowrap"
          >
            {isParsing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Extract Details'}
          </button>
        </div>
      </div>

      <TodoForm initialValues={initialData} onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Todo" />
    </div>
  );
};

export default CreateTodo;
