# Database Documentation

## SQLite Usage

The application uses SQLite for persistent storage. This keeps the project simple while satisfying the requirement to store data beyond application memory.

## Database Location

The default database file is created under the backend database folder and can be overridden with the DB_PATH environment variable.

## Schema

The `todos` table includes the following fields:

- id: INTEGER PRIMARY KEY AUTOINCREMENT
- title: TEXT NOT NULL
- description: TEXT
- status: TEXT NOT NULL DEFAULT 'pending'
- priority: TEXT NOT NULL DEFAULT 'medium'
- due_date: TEXT
- created_at: TEXT NOT NULL
- updated_at: TEXT NOT NULL
- completed_at: TEXT

## Status and Priority Constraints

Status values:

- pending
- in_progress
- completed

Priority values:

- low
- medium
- high

## Initialization Process

When the backend starts, it creates the database directory if needed, opens the SQLite database connection, and runs a table creation query if the todos table is missing.

This means the project works after standard setup without requiring manual database initialization steps.
