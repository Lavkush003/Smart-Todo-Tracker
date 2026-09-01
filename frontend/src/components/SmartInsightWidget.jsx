import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { getInsightWithAI } from '../services/todoService';

const SmartInsightWidget = () => {
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const data = await getInsightWithAI();
        setInsight(data.insight);
      } catch (err) {
        console.error('Failed to fetch insight', err);
        setInsight('Focus on your highest priority task today.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsight();
  }, []);

  return (
    <div className="mt-6 rounded-3xl border border-violet-200/70 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-500/10 p-4 dark:border-violet-800/50">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">Smart AI Insight</p>
      </div>
      {isLoading ? (
        <div className="mt-4 flex items-center justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
        </div>
      ) : (
        <p className="mt-3 text-[15px] font-medium leading-relaxed text-[var(--text-strong)]">
          "{insight}"
        </p>
      )}
    </div>
  );
};

export default SmartInsightWidget;
