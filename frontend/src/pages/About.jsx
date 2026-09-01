const About = () => (
  <div className="card p-8">
    <h1 className="text-3xl font-bold text-slate-900">About Ziptripp Todo</h1>
    <p className="mt-4 max-w-2xl text-slate-600">
      This productivity dashboard helps teams and individuals stay organized by tracking tasks,
      priorities, due dates, and completion progress. It is built with a React frontend and
      an Express + SQLite backend to keep the app simple, reliable, and easy to review.
    </p>
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="font-semibold text-slate-900">Smart tracking</h2>
        <p className="mt-2 text-sm text-slate-600">Search, filter, and sort tasks to stay focused on what matters most.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="font-semibold text-slate-900">Professional flow</h2>
        <p className="mt-2 text-sm text-slate-600">Create, edit, view, and delete tasks through clean multi-page routes.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="font-semibold text-slate-900">Reliable storage</h2>
        <p className="mt-2 text-sm text-slate-600">All changes persist in SQLite so the app remains useful after a restart.</p>
      </div>
    </div>
  </div>
);

export default About;
