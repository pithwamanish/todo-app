# ✨ TaskFlow AI — AI-Native Todo & Work Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-FCC624?logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**TaskFlow AI** is a modern, AI-native task and project management web application built with **Next.js 15**, **React 19**, and **TypeScript**. It features natural language task creation, an AI assistant panel with structured tool execution, multi-provider LLM routing, interactive Kanban boards, subtask checklists, and custom theme customization.

---

## 🌟 Key Features

### 🤖 AI-Powered Productivity
- **Natural Language Parsing**: Automatically extract task title, priority (`!urgent`, `!high`, `!medium`, `!low` or `p0`-`p3`), target project (`#project`), and relative due dates (`today`, `tomorrow`, `next monday`) from single-line text inputs.
- **Multi-Provider AI Router**: Supports OpenAI, Anthropic, Ollama (Local), and a robust Mock fallback provider for seamless offline and developer experiences.
- **AI Tool Calling Assistant**: Execute natural language commands via an AI Assistant Panel or Command Palette to execute actions like:
  - `create_task`: Create tasks with priority and due date
  - `update_task_status`: Move tasks between workflow columns
  - `filter_tasks`: Filter tasks by status, priority, or search query
  - `delete_completed`: Destructively clean up finished tasks (with safety confirmation guard)

### 📋 Flexible Work Management
- **Multiple Views**: Switch between structured **List View** and interactive drag-and-drop **Kanban Board** (`Todo`, `In Progress`, `Review`, `Done`).
- **Subtasks & Checklists**: Break down complex tasks into nested subtasks with real-time completion progress tracking.
- **Detailed Task Drawer**: View and edit task details, adjust priorities, assign project tags, and audit action logs.
- **Project Filtering**: Categorize work under projects and filter views per project context.

### 🎨 Design & User Experience
- **Theme Provider**: Built-in Dark Mode and Light Mode support with smooth transitions using CSS custom variables.
- **Responsive Layout**: Collapsible sidebar with automatic responsive adaptation for mobile/tablet viewports.
- **Full Test Coverage**: Comprehensive suite of 85 unit and integration tests powered by Vitest.

---

## 🏗️ Architecture & Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **State & Database**: In-memory repository with full validation type guards (`src/lib/db/repository.ts`)
- **Testing**: [Vitest 3](https://vitest.dev/) with `@testing-library/react`
- **Styling**: Vanilla CSS with Design System Tokens (`src/app/globals.css`)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pithwamanish/todo-app.git
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration & Environment Variables

TaskFlow AI works out of the box using the built-in Mock provider. To connect to LLM providers, set the following environment variables in a `.env.local` file:

```env
# Choose provider: 'mock' (default), 'openai', 'anthropic', or 'local'
AI_PROVIDER=openai

# API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Local Ollama endpoint (default: http://localhost:11434/api/generate)
LOCAL_AI_URL=http://localhost:11434/api/generate
```

---

## 🧪 Testing

Run the full test suite (15 test files, 85 unit/integration tests):

```bash
npm run test
```

To run a specific test file:

```bash
npm run test -- src/lib/ai/router.test.ts
```

---

## 👥 AI-Native Workflow Process

This repository follows an **AI-Native Workflow** orchestrated with role-specific subagents:

- **PM**: Grooms backlog items and defines acceptance criteria (`_docs/team/pm.md`)
- **Engineer**: Implements features according to acceptance criteria (`_docs/team/software-engineer.md`)
- **QA**: Runs test suites and verifies output against criteria (`_docs/team/qa-engineer.md`)

For more details on team processes, refer to [`_docs/process.md`](_docs/process.md) and [`AGENTS.md`](AGENTS.md).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
