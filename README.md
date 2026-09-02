# Taskora — Smart Todo & Productivity Manager

A production-grade, full-stack task management application built with **React**, **Express**, and **SQLite**. Taskora goes beyond basic CRUD — it features an **AI-powered chatbot assistant**, **user authentication**, a **rich analytics dashboard**, **dark mode**, and a beautifully polished, responsive UI designed for real-world productivity.

---

## ✨ Key Features

### 📋 Task Management (CRUD)
- Create, read, update, and delete todo items
- Mark tasks as **todo**, **in_progress**, **completed**, or **archived**
- Assign **priority levels**: low, medium, high, urgent
- Organize tasks by **categories**: Work, Personal, Study, Health, Projects, Other
- Set **due dates** with automatic overdue detection
- Add **descriptions**, **notes**, **tags**, and **estimated time**

### 🔍 Search, Filters & Sorting
- Full-text search across task titles, descriptions, and tags
- Filter by status, priority, and category
- Sort by newest, oldest, due date, priority, or status
- Debounced search for a snappy user experience

### 📊 Analytics Dashboard
- Visual metrics with total, pending, in-progress, completed, and overdue counts
- Beautiful stat cards with color-coded indicators
- Real-time data refresh on task updates

### 🤖 Taskora AI — Smart Chatbot Assistant
- Built-in AI assistant powered by **Google Gemini API**
- Ask natural language questions about your tasks (e.g., *"What's important today?"*, *"Show my overdue tasks"*)
- **AI-driven task actions**: create, update, complete, and delete tasks directly from the chat
- AI Smart Insight widget on task detail pages for priority and difficulty analysis
- Suggested prompts for quick interaction

### 🔐 User Authentication
- **Signup** and **Login** with secure password hashing (PBKDF2 + salt via Node.js `crypto`)
- **JWT-based authentication** — all API routes for tasks and chat are protected
- **Protected routes** on the frontend — unauthenticated users are redirected to the login page
- **Logout** button in the sidebar with session cleanup
- User name displayed in the header and avatar

### 🎨 UI / UX
- Modern, premium design with **glassmorphism**, **gradients**, and **micro-animations**
- Fully **responsive** layout for mobile and desktop
- **Dark mode / Light mode** toggle with persistent preference
- Floating AI assistant button for quick access from any page
- Beautiful Login & Signup pages with frosted-glass card design
- Color-coded priority badges and status indicators

---

## 🛠️ Technology Stack

| Layer        | Technology                                                |
|--------------|-----------------------------------------------------------|
| **Frontend** | React 18, Vite, React Router DOM v7, Tailwind CSS         |
| **Backend**  | Node.js, Express.js, better-sqlite3 (SQLite)              |
| **AI**       | Google Gemini API (`@google/genai`)                        |
| **Auth**     | Custom JWT + PBKDF2 hashing (Node.js native `crypto`)     |
| **Validation** | express-validator                                       |
| **API Client** | Axios (with auth interceptor)                           |
| **Icons**    | Lucide React                                              |
| **Dev Tools** | Nodemon, Concurrently, Vite HMR                          |

---

## 📁 Project Structure

```text
ZiptripProject/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                  # Environment config
│   │   ├── controllers/
│   │   │   ├── aiController.js         # Chat endpoint handler
│   │   │   ├── authController.js       # Login & Signup handlers
│   │   │   └── todoController.js       # CRUD handlers for todos
│   │   ├── database/
│   │   │   ├── db.js                   # SQLite setup (users + todos tables)
│   │   │   ├── seed.js                 # Database seeder
│   │   │   └── todos.db                # SQLite database file (auto-created)
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js        # JWT verification middleware
│   │   │   ├── errorHandler.js          # Global error handler
│   │   │   └── validateTodo.js          # Input validation rules
│   │   ├── routes/
│   │   │   ├── aiRoutes.js              # POST /api/chat
│   │   │   ├── authRoutes.js            # POST /api/auth/login, /api/auth/signup
│   │   │   └── todoRoutes.js            # CRUD routes for /api/todos
│   │   ├── services/
│   │   │   ├── aiService.js             # Gemini AI integration
│   │   │   └── todoService.js           # Database queries for todos
│   │   ├── utils/
│   │   │   └── response.js             # Consistent response helpers
│   │   ├── app.js                       # Express app setup
│   │   └── server.js                    # Server entry point
│   ├── test/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── ProtectedRoute.jsx       # Auth gate for routes
│   │   │   ├── SmartInsightWidget.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── TodoCard.jsx
│   │   │   └── TodoForm.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Global auth state (React Context)
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx           # Sidebar + header layout
│   │   ├── pages/
│   │   │   ├── Analytics.jsx            # Stats & analytics dashboard
│   │   │   ├── Assistant.jsx            # Taskora AI chatbot page
│   │   │   ├── CreateTodo.jsx           # New task form
│   │   │   ├── Dashboard.jsx            # Main task dashboard
│   │   │   ├── EditTodo.jsx             # Edit task form
│   │   │   ├── Login.jsx                # Login page
│   │   │   ├── Signup.jsx               # Signup page
│   │   │   ├── TodoDetails.jsx          # Task detail view
│   │   │   └── NotFound.jsx             # 404 page
│   │   ├── services/
│   │   │   ├── authService.js           # Auth API calls
│   │   │   └── todoService.js           # Todo + Chat API calls
│   │   ├── App.jsx                      # Route definitions
│   │   ├── main.jsx                     # App entry point
│   │   └── index.css                    # Global styles
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
├── package.json                         # Root workspace config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Google Gemini API key** (for the AI chatbot feature)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ZiptripProject
```

### 2. Install Dependencies

```bash
npm install --workspaces --include-workspace-root
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
DB_PATH=./database/todos.db
GEMINI_API_KEY=your-gemini-api-key-here
JWT_SECRET=your-secret-key-here
```

> **Note:** The `GEMINI_API_KEY` is required for the AI chatbot feature. You can get one from [Google AI Studio](https://aistudio.google.com/). The `JWT_SECRET` is used for signing authentication tokens.

### 4. Run the Application

Start both backend and frontend concurrently from the project root:

```bash
npm run dev
```

Or start them individually:

```bash
# Backend (runs on http://localhost:3001)
npm run dev --workspace backend

# Frontend (runs on http://localhost:5173)
npm run dev --workspace frontend
```

### 5. Open in Browser

Visit **[http://localhost:5173](http://localhost:5173)** — you'll be greeted by the Login page. Create an account to get started!

---

## 📡 API Endpoints

### Authentication (Public)

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/auth/signup`   | Register a new user      |
| POST   | `/api/auth/login`    | Login and receive JWT     |

### Todos (Protected — requires Bearer token)

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | `/api/todos`          | List all todos (with filters)|
| GET    | `/api/todos/stats`    | Get dashboard statistics     |
| GET    | `/api/todos/today`    | Get today's tasks            |
| GET    | `/api/todos/overdue`  | Get overdue tasks            |
| GET    | `/api/todos/:id`      | Get a single todo by ID      |
| POST   | `/api/todos`          | Create a new todo            |
| PUT    | `/api/todos/:id`      | Update an existing todo      |
| DELETE | `/api/todos/:id`      | Delete a todo                |

### AI Chatbot (Protected — requires Bearer token)

| Method | Endpoint       | Description                        |
|--------|----------------|------------------------------------|
| POST   | `/api/chat`    | Send a message to Taskora AI       |

> Full endpoint details and request/response schemas are documented in [docs/API.md](docs/API.md).

---

## 🗺️ Frontend Routes

| Route              | Page            | Description                          | Auth Required |
|--------------------|-----------------|--------------------------------------|---------------|
| `/login`           | Login           | User login page                      | ❌            |
| `/signup`          | Signup          | User registration page               | ❌            |
| `/`                | Dashboard       | Main task dashboard with stats       | ✅            |
| `/todo?id=ID`      | Todo Details    | Detailed view of a single task       | ✅            |
| `/create`          | Create Todo     | Form to create a new task            | ✅            |
| `/edit?todoid=ID`  | Edit Todo       | Form to edit an existing task        | ✅            |
| `/assistant`       | Taskora AI      | AI chatbot assistant                 | ✅            |
| `/analytics`       | Analytics       | Visual analytics and metrics         | ✅            |

---

## 🗄️ Database Schema

### `users` Table

| Column         | Type    | Description                    |
|----------------|---------|--------------------------------|
| `id`           | INTEGER | Primary key, auto-increment    |
| `name`         | TEXT    | User's full name               |
| `email`        | TEXT    | Unique email address           |
| `password_hash`| TEXT    | PBKDF2-hashed password         |
| `created_at`   | TEXT    | Account creation timestamp     |

### `todos` Table

| Column          | Type    | Description                              |
|-----------------|---------|------------------------------------------|
| `id`            | INTEGER | Primary key, auto-increment              |
| `title`         | TEXT    | Task title (required)                    |
| `description`   | TEXT    | Detailed description                     |
| `status`        | TEXT    | todo, in_progress, completed, archived   |
| `priority`      | TEXT    | low, medium, high, urgent                |
| `category`      | TEXT    | Work, Personal, Study, Health, etc.      |
| `tags`          | TEXT    | JSON array of tags                       |
| `due_date`      | TEXT    | Due date (ISO format)                    |
| `estimated_time`| TEXT    | Estimated time to complete               |
| `notes`         | TEXT    | Additional notes                         |
| `created_at`    | TEXT    | Creation timestamp                       |
| `updated_at`    | TEXT    | Last update timestamp                    |
| `completed_at`  | TEXT    | Completion timestamp                     |
| `user_id`       | INTEGER | Foreign key referencing users(id)        |

> The database is **automatically created** on first server start. No manual setup needed.

---

## 🔒 Authentication Flow

1. User visits the app → **redirected to `/login`** if not authenticated.
2. User creates an account on **`/signup`** → password is hashed with **PBKDF2 + random salt**.
3. Server returns a **JWT token** → stored in `localStorage`.
4. All subsequent API requests include the token via an **Axios interceptor** (`Authorization: Bearer <token>`).
5. Backend **middleware** verifies the token on every protected route.
6. User clicks **Logout** → token is cleared, user is redirected to `/login`.

---

## 🧠 AI Chatbot — How It Works

The Taskora AI assistant uses the **Google Gemini API** to provide intelligent, context-aware responses:

1. When a user sends a message, the backend builds a **context prompt** containing today's tasks and overdue tasks.
2. The AI is instructed to respond in **structured JSON** with a `reply` and optional `action`.
3. If the AI decides an action is needed (e.g., create, update, delete a task), the backend **automatically executes it** and confirms the result.
4. The response is sent back to the frontend and displayed in the chat interface.

**Example interactions:**
- *"What should I focus on today?"* → AI analyzes your tasks and gives personalized advice
- *"Create a task: Finish report by Friday, high priority"* → AI creates the task for you
- *"Mark task 5 as complete"* → AI completes the task

---

## ⚙️ Build Commands

```bash
# Build frontend for production
npm run build --workspace frontend

# Run backend tests
npm run test --workspace backend

# Seed the database with sample data
npm run seed --workspace backend
```

---

## 🧰 Error Handling

- Backend returns **consistent JSON responses** with `success`, `data`, `message`, and optional `details` fields.
- Validation errors return **400** responses with descriptive messages.
- Missing resources return **404** responses.
- Authentication failures return **401** responses.
- Frontend displays **loading spinners**, **empty states**, and **error messages** gracefully.

---

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- [API.md](docs/API.md) — Full API endpoint reference
- [FEATURES.md](docs/FEATURES.md) — Detailed feature descriptions
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture overview
- [DATABASE.md](docs/DATABASE.md) — Database schema documentation

---

## 🙏 Acknowledgements

- [Google Gemini API](https://ai.google.dev/) — AI chatbot intelligence
- [Lucide React](https://lucide.dev/) — Beautiful icon library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — Fast SQLite driver for Node.js
