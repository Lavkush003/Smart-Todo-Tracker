import { useState, useEffect } from 'react';
import { fetchStats } from '../services/todoService';
import { Loader2, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (error || !stats) {
    return <div className="rounded-xl bg-red-50 p-6 text-red-600 border border-red-200 font-semibold">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-strong)]">Productivity Analytics</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Track your progress and get insights into your habits.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-muted)]">Total Tasks</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-[var(--text-strong)]">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-muted)]">Completed</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-[var(--text-strong)]">{stats.completed}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{stats.completionPercentage}% completion rate</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-muted)]">In Progress</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-[var(--text-strong)]">{stats.inProgress}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-muted)]">Overdue</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-[var(--text-strong)]">{stats.overdue}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-[var(--text-strong)]">Recent Achievements</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-alt)] p-4">
              <div>
                <p className="font-semibold text-[var(--text-strong)]">Completed this week</p>
                <p className="text-xs text-[var(--text-muted)]">Keep up the momentum!</p>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{stats.completedThisWeek}</div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-alt)] p-4">
              <div>
                <p className="font-semibold text-[var(--text-strong)]">Completed this month</p>
                <p className="text-xs text-[var(--text-muted)]">Your 30-day productivity</p>
              </div>
              <div className="text-2xl font-bold text-violet-600">{stats.completedThisMonth}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-[var(--text-strong)]">Categories Breakdown</h3>
          <div className="space-y-3">
            {stats.categories?.length > 0 ? (
              stats.categories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-strong)]">{cat.category}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div 
                        className="h-full bg-violet-500 rounded-full" 
                        style={{ width: `${(cat.count / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm font-bold text-[var(--text-muted)]">{cat.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No category data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
