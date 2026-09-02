import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TodoDetails from './pages/TodoDetails';
import CreateTodo from './pages/CreateTodo';
import EditTodo from './pages/EditTodo';
import Assistant from './pages/Assistant';
import Analytics from './pages/Analytics';
import MainLayout from './layouts/MainLayout';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/todo" element={<TodoDetails />} />
        <Route path="/create" element={<CreateTodo />} />
        <Route path="/edit" element={<EditTodo />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
