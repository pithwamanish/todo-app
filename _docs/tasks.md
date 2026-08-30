# Project Task Backlog (MVP)

This backlog outlines the step-by-step implementation plan for the Minimum Viable Product (MVP) of the AI-native TODO & Work Management Platform (TypeScript Full-Stack Architecture). Each task is self-contained, focused on core MVP functionality, and designed to be completed in a single dev session.

---

## 1. Setup Empty Project with Passing Test
Goal: Initialize Next.js TypeScript repository baseline with test runner configuration and a passing starter unit test.
Description: Create the initial Next.js project structure with TypeScript, ESLint, and a unit test runner (Vitest/Jest). Configure `package.json` scripts so that `npm run test` and `npm run build` execute cleanly. Add a baseline unit test to verify environment stability.

## 2. Core Data Models & Repository Layer
Goal: Define TypeScript data types and a lightweight local persistence layer for tasks and projects.
Description: Define core data structures for Tasks, Subtasks, Projects, Statuses, and Priorities in `src/types/index.ts`. Implement a client-side repository service supporting task CRUD operations with initial seed data and local storage fallback. Add unit tests validating task creation, update, and deletion logic.

## 3. App Shell Layout & Design System
Goal: Build a responsive app layout shell and custom design system.
Description: Create CSS design tokens for themes (light/dark), typography, colors, and layout spacing. Implement the main application layout featuring a top header, collapsible navigation sidebar, and workspace container. Include view switcher controls to toggle between List and Kanban views.

## 4. Interactive Task List View
Goal: Implement a task list component with sorting, searching, and status filtering.
Description: Construct a task list displaying status badges, priority tags, due dates, and assignees. Add search inputs, status category filters, and quick task creation. Enable inline completion toggling and task title editing with optimistic state updates.

## 5. Interactive Kanban Board View
Goal: Build a multi-column Kanban board for managing task status workflows.
Description: Construct a Kanban board displaying tasks grouped into status columns (To Do, In Progress, Review, Done). Enable interactive drag-and-drop or status moves between columns. Support status column task counters and inline task creation within specific columns.

## 6. Task Detail Drawer & Subtask Checklist
Goal: Create a slide-out detail drawer for managing task details and subtasks.
Description: Build a detail drawer that slides open when selecting a task card. Add full description editing, priority and due date selection, and interactive subtask checklist management. Automatically compute subtask completion percentages and sync state with the main task.

## 7. AI Model Provider Gateway
Goal: Implement an AI router service for natural language task parsing and execution.
Description: Create an AI client module in `src/lib/ai/router.ts` connecting to model providers (OpenAI, Anthropic, or Ollama). Build prompt templates for parsing natural language inputs into task attributes (title, due date, priority, tags). Provide mock fallback responses for offline development without API keys.

## 8. AI Command Bar & Assistant Panel
Goal: Build a floating `Cmd+K` command palette and contextual AI assistant side-panel.
Description: Create a floating command bar (`Cmd+K`) accepting natural language commands such as "Add urgent task to finish docs by tomorrow". Implement a side assistant panel providing natural language answers and task summary cards. Connect user inputs to the AI gateway streaming response state.

## 9. AI Task Function Calling & Tool Execution
Goal: Enable the AI assistant to programmatically query and modify tasks using function calling.
Description: Define AI tools (`create_task`, `update_task_status`, `filter_tasks`, `delete_completed`) for agent execution. Connect tool execution directly to the task repository state so natural language prompts perform real UI updates. Render visual action confirmation badges in the AI chat feed.
