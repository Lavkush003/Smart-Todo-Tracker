const priorityStyles = {
  low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  medium: 'bg-orange-100 text-orange-700 border border-orange-200',
  high: 'bg-red-100 text-red-700 border border-red-200',
};

const PriorityBadge = ({ priority }) => (
  <span className={`badge ${priorityStyles[priority] || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
    {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium'}
  </span>
);

export default PriorityBadge;
