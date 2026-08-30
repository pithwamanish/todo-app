# Project Task Backlog

This backlog outlines self-contained, single-session tasks for building the AI-native TODO & Work Management Platform. Each task is independent and contains all required context so it can be handed off to a developer individually.

---

## 1. Setup Empty Project with Passing Test
Goal: Initialize the Next.js TypeScript repository baseline with test runner tooling and a passing unit test.
Description: Initialize a Next.js App Router project configured with TypeScript strict mode, ESLint, and a test runner such as Vitest or Jest. Set up `package.json` scripts including `npm run test` and `npm run build` so all commands execute without error. Create a starter unit test file in `src/app/page.test.tsx` that asserts true to verify the test pipeline functions correctly.

## 2. TypeScript Data Models and Interfaces
Goal: Define the domain data contracts for tasks, subtasks, projects, and AI tool definitions in TypeScript.
Description: Create schema types and TypeScript interfaces in `src/types/index.ts` representing Task, Subtask, Project, TaskStatus, TaskPriority, and AuditLog models. Include status enums (`todo`, `in_progress`, `review`, `done`) and priority levels (`low`, `medium`, `high`, `urgent`) with strong type annotations. Add unit tests verifying type guard functions and mock object instantiation.

## 3. Local Storage Task Repository Layer
Goal: Implement a client-side data repository for managing task persistence and state operations.
Description: Build a repository service module in `src/lib/db/repository.ts` that provides task CRUD functions using `localStorage` with initial seed data fallbacks. Expose methods for fetching all tasks, filtering by project or status, creating tasks, updating fields, and removing tasks. Include unit tests asserting CRUD operations and data persistence behaviors.

## 4. Custom CSS Design System and Theme Tokens
Goal: Create global CSS design tokens, typography rules, and theme switching utilities.
Description: Define CSS variables in `src/app/globals.css` covering HSL color palettes for dark/light themes, spacing scales, border radii, and font settings. Implement a Theme Provider context and toggle button enabling seamless switching between light and dark visual themes across the app. Add unit tests asserting theme state persistence and class name application.

## 5. App Shell and Navigation Layout
Goal: Construct the primary application shell featuring a top bar, navigation sidebar, and content container.
Description: Implement `src/components/layout/AppShell.tsx` and `src/components/layout/Sidebar.tsx` to establish the core application frame. Include project folder navigation, view mode selectors (List vs Kanban), theme toggle, and collapsible sidebar controls. Write component unit tests confirming sidebar collapse toggling and navigation link rendering.

## 6. Core Task List View Component
Goal: Build a task list view displaying items with status indicators, priorities, assignees, and due dates.
Description: Implement `src/components/tasks/TaskList.tsx` to render tasks in a structured list format with status badges, priority markers, due dates, and quick completion checkboxes. Enable inline task completion toggles that directly update state through the task repository layer. Add unit tests verifying list item rendering, status badge color formatting, and checkbox click handling.

## 7. Task Search, Filter, and Sort Controls
Goal: Provide interactive controls for searching, filtering, and sorting tasks within the application views.
Description: Build `src/components/tasks/TaskFilters.tsx` featuring text search input, status and priority dropdown filters, and sorting selectors (by due date, priority, or title). Connect filter inputs to task view state to update visible tasks in real-time without full page reloads. Write unit tests ensuring search text matching, multi-criteria filtering, and sort order execution operate correctly.

## 8. Interactive Kanban Board View
Goal: Implement a multi-column Kanban board displaying tasks organized by workflow status.
Description: Create `src/components/kanban/KanbanBoard.tsx` displaying vertical columns for To Do, In Progress, Review, and Done statuses. Render task cards in their corresponding status column with task counts displayed in column headers. Write unit tests confirming that tasks render in the correct status columns and empty column states display appropriately.

## 9. Kanban Status Transition and Card Movement
Goal: Enable moving tasks between Kanban columns to update status state.
Description: Update `src/components/kanban/KanbanBoard.tsx` with column drop targets and move controls to transition tasks between status columns. Trigger repository updates when a task card is moved to ensure status state changes persist immediately. Write unit tests asserting that moving a task updates its status and triggers repository state updates.

## 10. Task Detail Drawer Component
Goal: Build a slide-out drawer component for viewing and editing comprehensive task details.
Description: Create `src/components/tasks/TaskDetailDrawer.tsx` that slides open from the side when selecting a task card. Provide editable fields for task title, detailed description markdown, status dropdown, priority selector, and due date picker. Include unit tests verifying drawer visibility toggling and field edit change handler firing.

## 11. Subtask Checklist and Progress Tracker
Goal: Add subtask management and visual completion progress tracking inside the task detail drawer.
Description: Implement `src/components/tasks/SubtaskChecklist.tsx` allowing users to add, check off, and delete subtasks associated with a main task. Calculate subtask completion percentages dynamically and render a visual progress bar in the task card and detail drawer. Write unit tests checking subtask addition, toggle state calculations, and progress percentage updates.

## 12. AI Provider Model Gateway
Goal: Create a model-agnostic AI provider gateway supporting OpenAI, Anthropic, and local LLM options.
Description: Build `src/lib/ai/router.ts` to abstract AI API client calls behind a unified interface with support for external providers and mock fallback responses. Implement error handling, fallback model selection, and mock responses for local development when API keys are absent. Add unit tests asserting router fallback logic and formatted AI response returns.

## 13. Natural Language Task Parsing Prompts
Goal: Implement prompt templates and parser utilities to extract task properties from natural language inputs.
Description: Construct prompt engineering utilities in `src/lib/ai/parser.ts` that convert raw user text into structured task JSON objects. Parse titles, relative due dates, priority levels, and labels from input strings using fallback regex and AI routing outputs. Add unit tests validating structured JSON extraction across diverse natural language input strings.

## 14. Floating Command Palette Component (Cmd+K)
Goal: Implement a floating Cmd+K command palette for quick action search and natural language task input.
Description: Build `src/components/ai/CommandPalette.tsx` accessible via a `Cmd+K` keyboard shortcut or header button. Support quick global navigation, search actions, and direct natural language task creation input fields. Write unit tests verifying keyboard shortcut listeners, modal display toggling, and input submission triggering.

## 15. Contextual AI Assistant Side-Panel
Goal: Build an interactive side-panel chat interface for conversational AI task assistance.
Description: Create `src/components/ai/AIAssistantPanel.tsx` providing a chat interface where users can ask questions about their tasks and request workflow recommendations. Render message history, typing indicators, and formatted AI response cards with suggested follow-up actions. Add unit tests ensuring message rendering, chat history state management, and user input submission behave correctly.

## 16. AI Function Calling and Tool Execution
Goal: Connect AI assistant outputs to domain tool functions that perform programmatic task mutations.
Description: Define tool definitions and handlers in `src/lib/ai/tools.ts` for actions like `create_task`, `update_task_status`, `filter_tasks`, and `delete_completed`. Execute requested tool calls against the task repository state and return execution results back to the AI assistant feed with user confirmation UI badges. Write unit tests validating tool schema definitions, execution handler invocations, and state updates.
