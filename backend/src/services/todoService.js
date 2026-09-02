import db from '../database/db.js';

const isoNow = () => new Date().toISOString();

const formatTodo = (row) => {
  if (!row) return null;
  return {
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : [],
    due_date: row.due_date || null,
    completed_at: row.completed_at || null,
  };
};

export const getAllTodos = ({ search = '', status = '', priority = '', category = '', sort = 'created_at_desc' }) => {
  let query = 'SELECT * FROM todos WHERE 1 = 1';
  const params = [];

  if (search) {
    query += ' AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?) OR LOWER(tags) LIKE LOWER(?))';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  switch (sort) {
    case 'created_at_asc': query += ' ORDER BY created_at ASC'; break;
    case 'created_at_desc': query += ' ORDER BY created_at DESC'; break;
    case 'due_date_asc': query += ' ORDER BY due_date IS NULL, due_date ASC'; break;
    case 'due_date_desc': query += ' ORDER BY due_date IS NULL, due_date DESC'; break;
    case 'priority_desc':
      query += ' ORDER BY CASE priority WHEN "urgent" THEN 1 WHEN "high" THEN 2 WHEN "medium" THEN 3 WHEN "low" THEN 4 ELSE 5 END ASC';
      break;
    case 'priority_asc':
      query += ' ORDER BY CASE priority WHEN "low" THEN 1 WHEN "medium" THEN 2 WHEN "high" THEN 3 WHEN "urgent" THEN 4 ELSE 5 END ASC';
      break;
    case 'alphabetical': query += ' ORDER BY title ASC'; break;
    case 'status': query += ' ORDER BY status ASC'; break;
    default: query += ' ORDER BY created_at DESC';
  }

  const rows = db.prepare(query).all(...params);
  return rows.map(formatTodo);
};

export const getTodoById = (id) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
  return formatTodo(todo);
};

export const createTodo = (data) => {
  const timestamp = isoNow();
  const {
    title, description = '', status = 'todo', priority = 'medium', 
    category = 'Other', tags = [], due_date = null, estimated_time = '', notes = ''
  } = data;
  
  const result = db.prepare(`
    INSERT INTO todos (title, description, status, priority, category, tags, due_date, estimated_time, notes, created_at, updated_at, completed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title, description, status, priority, category, JSON.stringify(tags), 
    due_date, estimated_time, notes, timestamp, timestamp, status === 'completed' ? timestamp : null
  );

  return getTodoById(result.lastInsertRowid);
};

export const updateTodo = (id, updates) => {
  const existing = getTodoById(id);
  if (!existing) return null;

  const title = updates.title ?? existing.title;
  const description = updates.description ?? existing.description;
  const status = updates.status ?? existing.status;
  const priority = updates.priority ?? existing.priority;
  const category = updates.category ?? existing.category;
  const tags = updates.tags ? JSON.stringify(updates.tags) : JSON.stringify(existing.tags);
  const due_date = updates.due_date ?? existing.due_date;
  const estimated_time = updates.estimated_time ?? existing.estimated_time;
  const notes = updates.notes ?? existing.notes;
  const completed_at = updates.completed_at ?? existing.completed_at;
  const now = isoNow();

  db.prepare(`
    UPDATE todos
    SET title = ?, description = ?, status = ?, priority = ?, category = ?, tags = ?, due_date = ?, estimated_time = ?, notes = ?, updated_at = ?, completed_at = ?
    WHERE id = ?
  `).run(title, description, status, priority, category, tags, due_date, estimated_time, notes, now, status === 'completed' && existing.status !== 'completed' ? now : completed_at, id);

  return getTodoById(id);
};

export const deleteTodo = (id) => {
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  return result.changes > 0;
};

export const getStats = () => {
  const rows = db.prepare('SELECT status, priority, created_at, completed_at, due_date FROM todos').all();
  
  const total = rows.length;
  const completed = rows.filter(r => r.status === 'completed').length;
  const pending = rows.filter(r => r.status === 'todo').length;
  const inProgress = rows.filter(r => r.status === 'in_progress').length;
  
  const now = new Date();
  const overdue = rows.filter(r => {
    if (r.status === 'completed' || r.status === 'archived' || !r.due_date) return false;
    return new Date(r.due_date) < now;
  }).length;

  const highPriority = rows.filter(r => r.priority === 'high' || r.priority === 'urgent').length;
  
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // weekly and monthly logic
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const completedThisWeek = rows.filter(r => r.status === 'completed' && r.completed_at && new Date(r.completed_at) > oneWeekAgo).length;
  const completedThisMonth = rows.filter(r => r.status === 'completed' && r.completed_at && new Date(r.completed_at) > oneMonthAgo).length;

  // Categories mapping
  const cats = db.prepare('SELECT category, count(*) as count FROM todos GROUP BY category').all();
  
  return {
    total, completed, pending, inProgress, overdue, highPriority,
    completionPercentage, completedThisWeek, completedThisMonth,
    categories: cats
  };
};

export const getTodayTodos = () => {
  const rows = getAllTodos({});
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  return rows.filter(r => r.due_date && r.due_date.startsWith(todayStr) && r.status !== 'completed' && r.status !== 'archived');
};

export const getOverdueTodos = () => {
  const rows = getAllTodos({});
  const now = new Date();
  return rows.filter(r => {
    if (r.status === 'completed' || r.status === 'archived' || !r.due_date) return false;
    return new Date(r.due_date) < now;
  });
};
