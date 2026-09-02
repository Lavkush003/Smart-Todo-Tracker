import { GoogleGenAI } from '@google/genai';
import { getTodayTodos, getOverdueTodos, createTodo, updateTodo, deleteTodo } from './todoService.js';
import dotenv from 'dotenv';
dotenv.config();

// Use the latest model confirmed working with the user's API key
const MODEL = 'gemini-3.6-flash';

const buildContext = () => {
  try {
    const today = getTodayTodos().map(t => `- [ID:${t.id}] ${t.title} | priority: ${t.priority} | status: ${t.status}`);
    const overdue = getOverdueTodos().map(t => `- [ID:${t.id}] ${t.title} | priority: ${t.priority} | due: ${t.due_date?.split('T')[0]}`);

    let context = 'USER TASK CONTEXT:\n';
    context += `TODAY'S TASKS (${today.length}):\n${today.length ? today.join('\n') : 'None scheduled for today.'}\n\n`;
    context += `OVERDUE TASKS (${overdue.length}):\n${overdue.length ? overdue.join('\n') : 'No overdue tasks.'}\n`;
    return context;
  } catch (e) {
    return 'USER TASK CONTEXT:\n(Could not load tasks)\n';
  }
};

const buildSystemInstruction = (context) => `
You are "Taskora AI", a smart personal productivity assistant built into the Taskora task manager app.
You help users manage, understand, and act on their tasks.

${context}

IMPORTANT: Your response MUST always be a valid JSON object with this EXACT structure — no extra text before or after it:
{
  "reply": "<Your friendly, concise response to the user>",
  "action": null
}

If the user asks to CREATE a task, use:
{
  "reply": "<confirmation message>",
  "action": {
    "type": "createTodo",
    "payload": { "title": "Task title", "priority": "low|medium|high|urgent", "due_date": "YYYY-MM-DD or null", "category": "Work|Personal|Study|Health|Projects|Other" }
  }
}

If the user asks to COMPLETE a task (use the ID from context):
{
  "reply": "<confirmation message>",
  "action": {
    "type": "completeTodo",
    "payload": { "id": <numeric id> }
  }
}

If the user asks to UPDATE a task:
{
  "reply": "<confirmation message>",
  "action": {
    "type": "updateTodo",
    "payload": { "id": <numeric id>, "updates": { "title": "...", "priority": "...", "due_date": "..." } }
  }
}

If the user asks to DELETE a task:
{
  "reply": "<confirmation message>",
  "action": {
    "type": "deleteTodo",
    "payload": { "id": <numeric id> }
  }
}

For informational questions or advice, set "action" to null.
Be friendly, concise, and encouraging. Always stay on topic of the user's productivity.
`;

export const processChatMessage = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend/.env');
  }

  const ai = new GoogleGenAI({ apiKey });
  const context = buildContext();
  const systemInstruction = buildSystemInstruction(context);

  let rawText = '';
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: message,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    rawText = response.text;

    // Parse the JSON response from the AI
    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseErr) {
      // If JSON parse fails, extract plain text and wrap it
      console.warn('AI returned non-JSON, wrapping:', rawText.slice(0, 200));
      return { reply: rawText || 'I processed your request.', action: null };
    }

    const finalResponse = { reply: result.reply || 'Done!', action: null };

    // Safely execute AI-requested actions
    if (result.action && result.action.type && result.action.payload) {
      const { type, payload } = result.action;
      try {
        let actionResult = null;

        if (type === 'createTodo') {
          actionResult = createTodo({
            title: String(payload.title || 'New Task'),
            priority: payload.priority || 'medium',
            due_date: payload.due_date || null,
            category: payload.category || 'Other',
          });
        } else if (type === 'updateTodo') {
          actionResult = updateTodo(Number(payload.id), payload.updates || {});
        } else if (type === 'completeTodo') {
          actionResult = updateTodo(Number(payload.id), { status: 'completed' });
        } else if (type === 'deleteTodo') {
          const success = deleteTodo(Number(payload.id));
          actionResult = success ? { id: payload.id } : null;
        }

        finalResponse.action = {
          type,
          success: actionResult !== null && actionResult !== undefined && actionResult !== false,
          data: actionResult,
        };
      } catch (actionErr) {
        console.error('Action execution error:', actionErr.message);
        finalResponse.action = { type, success: false, error: actionErr.message };
      }
    }

    return finalResponse;
  } catch (error) {
    // Log the detailed error server-side
    console.error('=== Taskora AI Error ===');
    console.error('Model:', MODEL);
    console.error('Raw AI response:', rawText);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('=======================');

    // Return a helpful error based on the status code
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('401')) {
      throw new Error('Your Gemini API key is invalid. Please check backend/.env');
    }
    if (error.message?.includes('429') || error.message?.includes('QUOTA')) {
      throw new Error('Gemini API rate limit exceeded. Please wait and try again.');
    }
    if (error.message?.includes('404') || error.message?.includes('no longer available')) {
      throw new Error(`Model "${MODEL}" not available for your API key tier.`);
    }
    throw new Error(`AI service error: ${error.message}`);
  }
};
