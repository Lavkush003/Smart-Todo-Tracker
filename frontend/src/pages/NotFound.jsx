import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="card p-10 text-center">
    <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">404</p>
    <h1 className="mt-3 text-3xl font-bold text-slate-900">Page not found</h1>
    <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
    <Link to="/" className="primary-btn mt-6 inline-flex">
      Return home
    </Link>
  </div>
);

export default NotFound;
