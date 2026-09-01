# Ziptripp Todo Assessment

A production-style todo management application built with a React frontend, Express backend, and SQLite database. The app includes multiple routes, persistent data storage, validation, responsive UI, and a polished productivity dashboard.

## Features

- Dashboard with total, pending, in-progress, completed, and overdue metrics
- Create, read, update, and delete todo items
- Todo detail page using the required query parameter pattern: /todo?todoid=ID
- Edit page using the required query parameter pattern: /edit?todoid=ID
- Search, filters, sorting, and reset actions
- Status and priority management
- Overdue detection and due date tracking
- Responsive layout for mobile and desktop
- Validation on both frontend and backend
- SQLite persistence for durable storage
- **AI Smart Create**: Automatically extracts title, priority, and due date from natural language input.
- **AI Smart Insight**: Provides dynamic, personalized productivity tips based on pending tasks.
- **AI Subtask Generation**: Automatically breaks down complex tasks into manageable subtasks.

## Technology Stack

- Frontend: React, Vite, React Router DOM, Tailwind CSS
- Backend: Node.js, Express.js, SQLite, better-sqlite3
- Validation: express-validator
- API client: Axios
- Icons: Lucide React

## Project Structure

```text
ZiptripProject/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── test/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── docs/
│   ├── API.md
│   ├── FEATURES.md
│   ├── ARCHITECTURE.md
│   └── DATABASE.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Frontend Setup

1. Open a terminal in the project root.
2. Install dependencies:

```bash
npm install --workspaces --include-workspace-root
```

3. Start the frontend:

```bash
npm run dev --workspace frontend
```

4. Build the frontend:

```bash
npm run build --workspace frontend
```

## Backend Setup

1. Create a .env file based on .env.example.
2. Start the backend in development mode:

```bash
npm run dev --workspace backend
```

3. Or start the production server:

```bash
npm run start --workspace backend
```

## Environment Variables

Example values in [.env.example](.env.example):

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
DB_PATH=./database/todos.db
```

## Database Setup

The app automatically creates the SQLite database and todos table on first start. The database file is created under the backend database directory.

## API Endpoints

Base URL: /api

- GET /api/todos
- GET /api/todos/:id
- POST /api/todos
- PUT /api/todos/:id
- DELETE /api/todos/:id

## Available Routes

- /
- /todo?todoid=ID
- /create
- /edit?todoid=ID
- /about

## Query Parameter Usage

The detail and edit pages rely on the required query parameter approach:

- /todo?todoid=123
- /edit?todoid=123

If the ID is missing or invalid, the page shows an appropriate warning state.

## Running Locally

From the project root:

```bash
npm install --workspaces --include-workspace-root
npm run dev
```

This starts both the Express backend and the React frontend together.

## Build Commands

```bash
npm run build
npm run test --workspace backend
```

## Error Handling

- Backend returns consistent JSON responses with success and message fields.
- Validation errors return 400 responses.
- Missing resources return 404 responses.
- Frontend surfaces loading, empty, and error states gracefully.

## Screenshots

A screenshots section will be added in the future.

## Future Improvements

- Drag-and-drop task ordering
- User authentication and retained profiles
- Due-date reminders
- Task categories and labels
- Dark mode

## API Documentation

Full endpoint details are available in [docs/API.md](docs/API.md).
