import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { sendChatMessage } from '../services/todoService';

const suggestedPrompts = [
  "What's important today?",
  "Show my overdue tasks",
  "Help me plan my day",
  "Which task should I do first?",
  "Create a task for me",
  "Summarize my pending tasks",
];

const Assistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm Taskora AI, your personal productivity assistant. How can I help you manage your tasks today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    const msg = text.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setIsLoading(true);

    try {
      const responseData = await sendChatMessage(msg);
      const data = responseData.data;
      
      let assistantMsg = data.reply;
      
      // If there was an action taken, append it to the message for the user to see
      if (data.action) {
        if (data.action.success) {
          assistantMsg += `\n\n✅ Action successful: ${data.action.type}`;
        } else {
          assistantMsg += `\n\n❌ Action failed: ${data.action.error}`;
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: assistantMsg }]);
    } catch (error) {
      const detail = error?.response?.data?.details || error?.response?.data?.message || error.message || 'Unknown error';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `⚠️ Error: ${detail}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{ role: 'assistant', text: "Chat cleared. What's next?" }]);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--panel-alt)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-strong)]">Taskora AI</h2>
            <p className="text-xs text-[var(--text-muted)]">Always here to help</p>
          </div>
        </div>
        <button onClick={handleClear} className="secondary-btn flex items-center gap-2 px-3 py-1.5 text-xs">
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-violet-100 text-violet-600'}`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-[15px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'rounded-tr-sm bg-violet-600 text-white shadow-md' 
                  : 'rounded-tl-sm border border-[var(--border)] bg-[var(--panel-alt)] text-[var(--text)]'
              }`}>
                <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--panel-alt)] px-5 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
                <span className="text-sm font-medium text-[var(--text-muted)]">Taskora is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--panel-alt)] p-4">
        <div className="mx-auto max-w-3xl">
          {messages.length < 3 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50 dark:border-violet-800 dark:bg-slate-800 dark:text-violet-300 dark:hover:bg-slate-700"
                >
                  <Sparkles className="h-3 w-3" />
                  {prompt}
                </button>
              ))}
            </div>
          )}
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white p-1 pr-2 shadow-sm focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 dark:bg-slate-900"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Taskora anything..."
              className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
