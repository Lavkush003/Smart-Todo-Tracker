const EmptyState = ({ title, message, actionLabel, onAction }) => (
  <div className="card flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">📝</div>
    <div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-600">{message}</p>
    </div>
    {actionLabel && onAction && (
      <button type="button" onClick={onAction} className="primary-btn">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
