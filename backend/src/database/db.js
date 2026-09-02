import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';

const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(config.dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

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
    completed_at TEXT,
    user_id INTEGER REFERENCES users(id)
  );
`);

const tableInfo = db.pragma('table_info(todos)');
const hasUserId = tableInfo.some(column => column.name === 'user_id');
if (!hasUserId) {
  db.exec(`ALTER TABLE todos ADD COLUMN user_id INTEGER REFERENCES users(id)`);
}

export default db;
