import { processChatMessage } from '../services/aiService.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return errorResponse(res, 400, 'Message is required and must be a non-empty string');
    }

    const responseData = await processChatMessage(message.trim());
    return successResponse(res, 200, responseData, 'Chat processed successfully');
  } catch (error) {
    // Return the specific AI error message so frontend can display it usefully
    console.error('Chat controller error:', error.message);
    return errorResponse(res, 500, 'AI service error', error.message);
  }
};
