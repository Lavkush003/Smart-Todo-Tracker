const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  in_progress: 'bg-blue-100 text-blue-700 border border-blue-200',
  completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

const StatusBadge = ({ status }) => {
  const value = status?.replace('_', ' ') || 'Pending';
  return (
    <span className={`badge ${statusStyles[status] || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
      {value}
    </span>
  );
};

export default StatusBadge;
