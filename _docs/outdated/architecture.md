# Architecture & Tech Stack Decisions

**Project:** Enterprise AI-Native TODO & Work Management Platform  
**Selected Architecture Option:** Option 1 — Modern Full-Stack TypeScript Architecture  

---

## 1. Executive Summary

The platform is designed as an AI-native work management application built on a unified TypeScript stack. It provides high developer velocity, full type safety across frontend and backend layers, and native support for Model Context Protocol (MCP) and LLM agent orchestration.

---

## 2. Core Tech Stack Breakdown

### 2.1 Framework & Runtime
* **Framework:** Next.js (App Router, React 19, TypeScript)
* **Language:** TypeScript (Strict mode enabled)
* **Package Manager / Runtime:** Node.js (v22+) & npm

### 2.2 Frontend & UI System
* **UI Architecture:** Server Components + Client Islands for interactive views (Kanban, List, Command Palette).
* **Styling & Tokens:** Custom CSS System (Vanilla CSS / CSS Modules) with HSL color variables, dark/light theme support, and responsive layouts.
* **Component Library:** Built-in modular component primitives (Buttons, Modals, Badges, Drawers, Inputs).
* **Views:** Switchable Task List, Drag-and-Drop Kanban Board, Task Detail Drawer, and Floating Command Palette (`Cmd+K`).

### 2.3 State Management & Data Layer
* **Data Architecture:** Local Repository Pattern for MVP (IndexedDB / LocalStorage fallback with seed data).
* **Target Enterprise DB:** PostgreSQL + Drizzle ORM (supporting Row-Level Security for multi-tenancy).
* **Domain Models:** Strong TypeScript domain models for Tasks, Subtasks, Projects, Statuses, Priorities, and Audit Logs.

### 2.4 AI Engine & Agent Architecture
* **Agent Framework:** Vercel AI SDK / Model Context Protocol (MCP) Integration.
* **Model Router (`src/lib/ai/router.ts`):** Model-agnostic router supporting OpenAI, Anthropic, and local Ollama models with fallback mechanisms.
* **Function Calling & Tool Execution:**
  - `create_task`: Programmatically generate tasks from natural language.
  - `update_task_status`: Transition tasks between workflow columns.
  - `filter_tasks`: Query and highlight tasks matching natural language filters.
  - `delete_completed`: Bulk action handling.
* **AI UI Surfaces:** Floating Command Palette (`Cmd+K`) and Contextual Assistant Side-Panel.

### 2.5 Quality Assurance & Testing
* **Test Runner:** Vitest / Jest configured for unit and integration testing.
* **Linting & Code Quality:** ESLint + TypeScript strict checks.
* **CI Automation:** GitHub Actions running `npm run build` and `npm run test` on pull requests.

---

## 3. Project Directory Structure

```
todo-app/
├── _docs/                  # Project documentation (plan, tasks, architecture, process)
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API Routes)
│   ├── components/         # UI Components (Tasks, Kanban, AI Command Bar, Layout)
│   ├── lib/                # Core utilities
│   │   ├── ai/             # AI Model Router, Prompt Templates, MCP Tools
│   │   ├── db/             # Data repository and schemas
│   │   └── utils/          # Helper utilities
│   └── types/              # Domain TypeScript types & interfaces
├── package.json
└── tsconfig.json
```
