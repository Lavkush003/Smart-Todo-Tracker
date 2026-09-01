const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-soft">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default LoadingSpinner;
