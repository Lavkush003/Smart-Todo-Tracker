import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-flash'; // Good default model

export const parseTaskWithAI = async (text) => {
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured');

    const prompt = `
      You are an AI assistant that extracts task information from a user's natural language input.
      Extract the following fields from the input text:
      - title: A concise string representing the task (max 60 chars).
      - description: Any extra context from the input. Keep it brief. Empty string if none.
      - priority: Must be one of: 'low', 'medium', 'high'. Guess based on words like 'urgent', 'ASAP', 'high priority'. Default 'medium'.
      - due_date: If a timeframe is mentioned (e.g. 'tomorrow', 'next week'), calculate an ISO 8601 string for it (current time is ${new Date().toISOString()}). Otherwise, null.

      Input: "${text}"

      Respond ONLY with a valid JSON object matching this structure:
      {
        "title": "...",
        "description": "...",
        "priority": "...",
        "due_date": "..." // or null
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('AI Parse Task Error:', error);
    throw new Error('Failed to parse task using AI.');
  }
};

export const getInsightWithAI = async (todos) => {
  try {
    if (!process.env.GEMINI_API_KEY) return "Set GEMINI_API_KEY in .env to enable smart insights.";
    
    // Only send minimal data to AI
    const pendingTodos = todos.filter(t => t.status !== 'completed').map(t => ({
      title: t.title,
      priority: t.priority,
      due_date: t.due_date
    }));

    if (pendingTodos.length === 0) return "You're all caught up! Enjoy your free time.";

    const prompt = `
      You are a productivity coach. Here is a list of my pending tasks:
      ${JSON.stringify(pendingTodos)}

      Provide a SINGLE, short, highly motivating sentence (max 15 words) telling me what I should focus on right now to get an easy win or tackle the most important thing. Make it punchy. Don't use quotes.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error('AI Insight Error:', error);
    return "Focus on your highest priority task today.";
  }
};

export const generateSubtasksWithAI = async (todo) => {
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured');

    const prompt = `
      Break down the following task into 3 to 5 logical, actionable subtasks.
      Task Title: "${todo.title}"
      Description: "${todo.description || ''}"

      Respond ONLY with a valid JSON array of strings representing the subtasks.
      Example: ["Step 1", "Step 2", "Step 3"]
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('AI Subtasks Error:', error);
    throw new Error('Failed to generate subtasks using AI.');
  }
};
