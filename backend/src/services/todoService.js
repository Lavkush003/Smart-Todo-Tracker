import db from '../database/db.js';

const isoNow = () => new Date().toISOString();
const formatTodo = (row) => ({
  ...row,
  due_date: row.due_date || null,
  completed_at: row.completed_at || null,
});

export const getAllTodos = ({ search = '', status = '', priority = '', sort = 'created_at_desc' }) => {
  let query = 'SELECT * FROM todos WHERE 1 = 1';
  const params = [];

  if (search) {
    query += ' AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }

  switch (sort) {
    case 'created_at_asc':
      query += ' ORDER BY created_at ASC';
      break;
    case 'created_at_desc':
      query += ' ORDER BY created_at DESC';
      break;
    case 'due_date_asc':
      query += ' ORDER BY due_date IS NULL, due_date ASC';
      break;
    case 'due_date_desc':
      query += ' ORDER BY due_date IS NULL, due_date DESC';
      break;
    case 'priority_high':
      query += ' ORDER BY CASE priority WHEN "high" THEN 1 WHEN "medium" THEN 2 WHEN "low" THEN 3 ELSE 4 END ASC';
      break;
    case 'priority_low':
      query += ' ORDER BY CASE priority WHEN "low" THEN 1 WHEN "medium" THEN 2 WHEN "high" THEN 3 ELSE 4 END ASC';
      break;
    default:
      query += ' ORDER BY created_at DESC';
  }

  const rows = db.prepare(query).all(...params);
  return rows.map(formatTodo);
};

export const getTodoById = (id) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  return todo ? formatTodo(todo) : null;
};

export const createTodo = ({ title, description = '', status = 'pending', priority = 'medium', due_date = null }) => {
  const timestamp = isoNow();
  const result = db.prepare(`
    INSERT INTO todos (title, description, status, priority, due_date, created_at, updated_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, description, status, priority, due_date, timestamp, timestamp, status === 'completed' ? timestamp : null);

  return getTodoById(result.lastInsertRowid);
};

export const updateTodo = (id, updates) => {
  const existing = getTodoById(id);
  if (!existing) return null;

  const title = updates.title ?? existing.title;
  const description = updates.description ?? existing.description;
  const status = updates.status ?? existing.status;
  const priority = updates.priority ?? existing.priority;
  const due_date = updates.due_date ?? existing.due_date;
  const completed_at = updates.completed_at ?? existing.completed_at;
  const now = isoNow();

  db.prepare(`
    UPDATE todos
    SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = ?, completed_at = ?
    WHERE id = ?
  `).run(title, description, status, priority, due_date, now, status === 'completed' ? completed_at || now : null, id);

  return getTodoById(id);
};

export const deleteTodo = (id) => {
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  return result.changes > 0;
};
