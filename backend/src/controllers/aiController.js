import { generateSubtasksWithAI, getInsightWithAI, parseTaskWithAI } from '../services/aiService.js';
import { getAllTodos, getTodoById } from '../services/todoService.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const parseTask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return errorResponse(res, 400, 'Text input is required');
    
    const parsedData = await parseTaskWithAI(text);
    return successResponse(res, 200, parsedData, 'Task parsed successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to parse task', error.message);
  }
};

export const getInsight = async (req, res) => {
  try {
    const todos = getAllTodos({});
    const insight = await getInsightWithAI(todos);
    return successResponse(res, 200, { insight }, 'Insight generated successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to generate insight', error.message);
  }
};

export const generateSubtasks = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = getTodoById(Number(id));
    
    if (!todo) return errorResponse(res, 404, 'Todo not found');

    const subtasks = await generateSubtasksWithAI(todo);
    return successResponse(res, 200, { subtasks }, 'Subtasks generated successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to generate subtasks', error.message);
  }
};
