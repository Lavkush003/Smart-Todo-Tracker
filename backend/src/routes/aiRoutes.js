import express from 'express';
import { generateSubtasks, getInsight, parseTask } from '../controllers/aiController.js';

const router = express.Router();

router.post('/parse-task', parseTask);
router.get('/insight', getInsight);
router.post('/:id/subtasks', generateSubtasks);

export default router;
