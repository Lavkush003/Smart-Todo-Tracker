import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  getStats,
  getTodayTodos,
  getOverdueTodos
} from '../services/todoService.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const listTodos = (req, res) => {
  try {
    const { search = '', status = '', priority = '', category = '', sort = 'created_at_desc' } = req.query;
    const todos = getAllTodos({ search, status, priority, category, sort });
    return successResponse(res, 200, todos, 'Todos fetched successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to fetch todos', error.message);
  }
};

export const getTodo = (req, res) => {
  try {
    const todo = getTodoById(Number(req.params.id));
    if (!todo) {
      return errorResponse(res, 404, 'Todo not found');
    }
    return successResponse(res, 200, todo, 'Todo fetched successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to fetch todo', error.message);
  }
};

export const createTodoItem = (req, res) => {
  try {
    const todo = createTodo(req.body);
    return successResponse(res, 201, todo, 'Todo created successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to create todo', error.message);
  }
};

export const updateTodoItem = (req, res) => {
  try {
    const updatedTodo = updateTodo(Number(req.params.id), req.body);
    if (!updatedTodo) {
      return errorResponse(res, 404, 'Todo not found');
    }
    return successResponse(res, 200, updatedTodo, 'Todo updated successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to update todo', error.message);
  }
};

export const deleteTodoItem = (req, res) => {
  try {
    const deleted = deleteTodo(Number(req.params.id));
    if (!deleted) {
      return errorResponse(res, 404, 'Todo not found');
    }
    return successResponse(res, 200, { id: Number(req.params.id) }, 'Todo deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to delete todo', error.message);
  }
};

export const getTodoStats = (req, res) => {
  try {
    const stats = getStats();
    return successResponse(res, 200, stats, 'Stats fetched successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to fetch stats', error.message);
  }
};

export const getTodayTasks = (req, res) => {
  try {
    const todos = getTodayTodos();
    return successResponse(res, 200, todos, 'Today tasks fetched successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to fetch today tasks', error.message);
  }
};

export const getOverdueTasks = (req, res) => {
  try {
    const todos = getOverdueTodos();
    return successResponse(res, 200, todos, 'Overdue tasks fetched successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to fetch overdue tasks', error.message);
  }
};
