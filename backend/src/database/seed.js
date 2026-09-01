import db from './db.js';

const seedTodos = [
  {
    title: 'Complete project documentation',
    description: 'Finalize README and API docs for the Ziptripp assessment.',
    status: 'in_progress',
    priority: 'high',
    due_date: '2026-09-05',
  },
  {
    title: 'Review API endpoints',
    description: 'Test all todo routes and payload validation using the backend API.',
    status: 'pending',
    priority: 'medium',
    due_date: '2026-09-10',
  },
  {
    title: 'Prepare placement assessment',
    description: 'Ensure the React dashboard, details page, and forms are polished and responsive.',
    status: 'completed',
    priority: 'high',
    due_date: '2026-09-02',
  },
  {
    title: 'Test responsive UI',
    description: 'Check mobile and desktop layouts for the task dashboard.',
    status: 'pending',
    priority: 'low',
    due_date: '2026-09-12',
  },
];

const now = new Date().toISOString();

for (const todo of seedTodos) {
  const exists = db.prepare('SELECT 1 FROM todos WHERE title = ? LIMIT 1').get(todo.title);
  if (!exists) {
    db.prepare(`
      INSERT INTO todos (title, description, status, priority, due_date, created_at, updated_at, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      todo.title,
      todo.description,
      todo.status,
      todo.priority,
      todo.due_date,
      now,
      now,
      todo.status === 'completed' ? now : null,
    );
  }
}

console.log('Seed data initialized successfully.');
