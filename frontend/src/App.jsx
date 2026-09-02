import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TodoDetails from './pages/TodoDetails';
import CreateTodo from './pages/CreateTodo';
import EditTodo from './pages/EditTodo';
import Assistant from './pages/Assistant';
import Analytics from './pages/Analytics';
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todo" element={<TodoDetails />} />
        <Route path="/create" element={<CreateTodo />} />
        <Route path="/edit" element={<EditTodo />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
