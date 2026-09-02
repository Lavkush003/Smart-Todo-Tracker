import db from './db.js';

const seedTodos = [
  {
    title: 'Complete project documentation',
    description: 'Finalize README and API docs for Taskora.',
    status: 'in_progress',
    priority: 'high',
    category: 'Work',
    tags: JSON.stringify(['documentation', 'urgent']),
    due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    estimated_time: '2 hours',
    notes: 'Make sure to mention the AI features.'
  },
  {
    title: 'Review API endpoints',
    description: 'Test all todo routes and AI action payload validation.',
    status: 'todo',
    priority: 'medium',
    category: 'Development',
    tags: JSON.stringify(['api', 'testing']),
    due_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    estimated_time: '1 hour',
    notes: ''
  },
  {
    title: 'Prepare UI presentation',
    description: 'Ensure the React dashboard, details page, and chat UI are polished.',
    status: 'completed',
    priority: 'urgent',
    category: 'Work',
    tags: JSON.stringify(['ui', 'design']),
    due_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    estimated_time: '3 hours',
    notes: ''
  },
  {
    title: 'Submit resume',
    description: 'Update PDF and send it to the recruiters.',
    status: 'todo',
    priority: 'urgent',
    category: 'Personal',
    tags: JSON.stringify(['career']),
    due_date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago (overdue)
    estimated_time: '30 mins',
    notes: 'Tailor it for full-stack role.'
  },
];

const now = new Date().toISOString();

db.exec('DROP TABLE IF EXISTS todos;');
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'completed', 'archived')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    category TEXT DEFAULT 'Other',
    tags TEXT DEFAULT '[]',
    due_date TEXT,
    estimated_time TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    completed_at TEXT
  );
`);

for (const todo of seedTodos) {
  const exists = db.prepare('SELECT 1 FROM todos WHERE title = ? LIMIT 1').get(todo.title);
  if (!exists) {
    db.prepare(`
      INSERT INTO todos (
        title, description, status, priority, category, tags, 
        due_date, estimated_time, notes, created_at, updated_at, completed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      todo.title,
      todo.description,
      todo.status,
      todo.priority,
      todo.category,
      todo.tags,
      todo.due_date,
      todo.estimated_time,
      todo.notes,
      now,
      now,
      todo.status === 'completed' ? now : null,
    );
  }
}

console.log('Taskora seed data initialized successfully.');
