import express from 'express';
import {
  createTodoItem,
  deleteTodoItem,
  getTodo,
  listTodos,
  updateTodoItem,
} from '../controllers/todoController.js';
import { validateTodoId, validateTodoPayload } from '../middleware/validateTodo.js';

const router = express.Router();

router.get('/', listTodos);
router.get('/:id', validateTodoId, getTodo);
router.post('/', validateTodoPayload, createTodoItem);
router.put('/:id', validateTodoId, validateTodoPayload, updateTodoItem);
router.delete('/:id', validateTodoId, deleteTodoItem);

export default router;
