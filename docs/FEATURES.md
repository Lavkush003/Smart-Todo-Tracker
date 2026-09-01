# Feature Documentation

## Dashboard

The dashboard is the main productivity screen and includes:

- Total task count
- Pending metrics
- In-progress metrics
- Completed metric
- Overdue tracking
- Search across titles and descriptions
- Status and priority filters
- Sorting controls
- Responsive todo cards

## Smart AI Features (Gemini Integration)

- **Magic Extract (Smart Create)**: Users can type a natural language sentence and the AI parses it to automatically set the Task Title, Due Date, and Priority in the creation form.
- **Smart Insight**: The dashboard sidebar dynamically calls Gemini to give a short, punchy productivity tip based on the user's currently pending tasks.
- **Subtask Generator**: On the Todo Details page, users can click a button to have the AI automatically generate 3-5 logical subtasks to help break down complex work.

## Todo Creation

Users can create tasks from the create page using a professional form with validation. Required fields include the task title. Optional fields include description, status, priority, and due date.

## Todo Editing

The edit page loads an existing todo by query parameter and populates the form with the current values. Users can save updates after validation.

## Todo Deletion

Tasks can be deleted from the dashboard or detail page after confirmation. The UI updates immediately after a successful delete request.

## Todo Details

The details page shows full information for a todo and supports viewing the task in a focused layout. It includes status, priority, created date, updated date, due date, and completion date when available.

## Search

The dashboard supports search by both title and description with instant filtering across the list of todos.

## Filtering

Users can narrow the results by:

- status
- priority

## Sorting

Users can sort by:

- created date ascending or descending
- due date ascending or descending
- priority order

## Status Management

Todo statuses supported by the app:

- pending
- in_progress
- completed

## Priority Management

Todo priorities supported by the app:

- low
- medium
- high

## Due Dates

Due dates are stored, displayed, and used for overdue detection. The dashboard highlights overdue tasks.

## Responsive Design

The application is optimized for desktop, tablet, and mobile layouts and avoids layout issues on narrow screens.

## Error Handling

The app includes both frontend and backend error states:

- loading states
- empty states
- validation warnings
- API failures
- missing todo handling

## Validation

Both the client and server validate incoming input to prevent invalid data and malformed requests.
