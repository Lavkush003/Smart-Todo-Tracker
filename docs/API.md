# API Documentation

This document describes the Todo application REST API.

## Base URL

`/api`

## GET /api/todos

Purpose: Retrieve all todos with optional filtering, search, and sorting.

Query parameters:

- search: string
- status: pending | in_progress | completed
- priority: low | medium | high
- sort: created_at_desc | created_at_asc | due_date_asc | due_date_desc | priority_high | priority_low

Success response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Complete assessment",
      "description": "Finish the Ziptripp project",
      "status": "pending",
      "priority": "high",
      "due_date": "2026-09-10",
      "created_at": "2026-09-01T09:00:00.000Z",
      "updated_at": "2026-09-01T09:00:00.000Z",
      "completed_at": null
    }
  ],
  "message": "Todos fetched successfully"
}
```

## GET /api/todos/:id

Purpose: Fetch a single todo by its ID.

Parameters:

- id: positive integer

Success response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete assessment",
    "description": "Finish the Ziptripp project",
    "status": "pending",
    "priority": "high",
    "due_date": "2026-09-10",
    "created_at": "2026-09-01T09:00:00.000Z",
    "updated_at": "2026-09-01T09:00:00.000Z",
    "completed_at": null
  },
  "message": "Todo fetched successfully"
}
```

Error response:

```json
{
  "success": false,
  "message": "Todo not found"
}
```

## POST /api/todos

Purpose: Create a new todo.

Request body:

```json
{
  "title": "Complete assessment",
  "description": "Finish the Ziptripp assignment.",
  "priority": "high",
  "status": "pending",
  "due_date": "2026-09-10"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Complete assessment",
    "description": "Finish the Ziptripp assignment.",
    "priority": "high",
    "status": "pending",
    "due_date": "2026-09-10",
    "created_at": "2026-09-01T09:00:00.000Z",
    "updated_at": "2026-09-01T09:00:00.000Z",
    "completed_at": null
  },
  "message": "Todo created successfully"
}
```

Validation error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": [
    { "field": "title", "message": "Title is required" }
  ]
}
```

## PUT /api/todos/:id

Purpose: Update an existing todo.

Request body:

```json
{
  "title": "Updated assessment",
  "description": "Refined task summary",
  "status": "completed",
  "priority": "medium",
  "due_date": "2026-09-12"
}
```

Success response:

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Updated assessment",
    "description": "Refined task summary",
    "status": "completed",
    "priority": "medium",
    "due_date": "2026-09-12",
    "created_at": "2026-09-01T09:00:00.000Z",
    "updated_at": "2026-09-01T09:30:00.000Z",
    "completed_at": "2026-09-01T09:30:00.000Z"
  },
  "message": "Todo updated successfully"
}
```

## DELETE /api/todos/:id

Purpose: Delete a todo.

Success response:

```json
{
  "success": true,
  "data": {
    "id": 5
  },
  "message": "Todo deleted successfully"
}
```

## Error Handling

The API responds with:

- 200 for successful reads and updates
- 201 for successful creation
- 400 for validation errors
- 404 when a todo is missing
- 500 for unexpected server errors
