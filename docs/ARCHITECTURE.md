# Architecture

## Frontend Architecture

The frontend is built with React and Vite. It uses multiple routes rather than a single-page interface to satisfy the assessment requirement. Routing is handled through React Router, and UI is styled using Tailwind CSS.

Components are separated into reusable pieces such as:

- TodoCard
- TodoForm
- StatusBadge
- PriorityBadge
- LoadingSpinner
- EmptyState

The application uses a service layer for API communication, which keeps the UI components clean and easier to maintain.

## Backend Architecture

The backend is built with Express and structured into clear responsibilities:

- routes: HTTP endpoint definitions
- controllers: request handling and response shaping
- services: business logic and database access orchestration
- database: SQLite connection and schema initialization
- middleware: validation and error handling

This structure supports readability and keeps logic separated by concern.

## API Communication

The frontend requests the backend through Axios. The API layer centralizes base URL configuration and request/response handling so the UI does not duplicate network code.

## Database Design

The app uses SQLite for persistence. The todos table includes:

- id
- title
- description
- status
- priority
- due_date
- created_at
- updated_at
- completed_at

The table is initialized automatically when the backend starts if it does not already exist.

## Data Flow

1. The user interacts with the dashboard or form.
2. The frontend calls the backend API.
3. The controller validates the request.
4. The service performs the database operation.
5. The response is returned to the UI and state is refreshed.

## Routing Strategy

The application uses route-based navigation with query-string identifiers for detail and edit pages:

- /todo?todoid=ID
- /edit?todoid=ID

This is explicit and meets the assignment requirement.

## Design Decisions

- SQLite is used instead of a document database to keep the setup simple and persistent.
- Query parameters are used for todo detail and edit pages as required by the assessment.
- Tailwind was chosen for styling to produce a clean, responsive SaaS-like interface quickly.
- Validation is enforced both on the client and the server to reduce invalid data entering the system.
