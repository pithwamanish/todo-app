import { Task, TaskStatus, Project } from '@/types';

export const TASKS_STORAGE_KEY = 'todo_app_tasks_v1';
export const PROJECTS_STORAGE_KEY = 'todo_app_projects_v1';

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'General',
    description: 'Default project for general tasks',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Welcome to Todo App',
    description: 'Get started by exploring tasks and Kanban board',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj-1',
    subtasks: [
      {
        id: 'subtask-1',
        title: 'Review existing tasks',
        completed: false,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ],
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function isStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function getItem<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable()) {
    return defaultValue;
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      setItem(key, defaultValue);
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch {
    setItem(key, defaultValue);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isStorageAvailable()) {
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Graceful handling if localStorage quota exceeded or restricted
  }
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getAllTasks(): Task[] {
  return getItem<Task[]>(TASKS_STORAGE_KEY, SEED_TASKS);
}

export function getTaskById(id: string): Task | null {
  const tasks = getAllTasks();
  return tasks.find((t) => t.id === id) || null;
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  const tasks = getAllTasks();
  return tasks.filter((t) => t.status === status);
}

export function createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const tasks = getAllTasks();
  const now = new Date().toISOString();
  const newTask: Task = {
    ...taskData,
    id: generateId('task'),
    createdAt: now,
    updatedAt: now,
  };
  const updatedTasks = [...tasks, newTask];
  setItem(TASKS_STORAGE_KEY, updatedTasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = getAllTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return null;
  }

  const now = new Date().toISOString();
  const updatedTask: Task = {
    ...tasks[index],
    ...updates,
    id: tasks[index].id, // id cannot be mutated
    createdAt: tasks[index].createdAt, // createdAt cannot be mutated
    updatedAt: now,
  };

  tasks[index] = updatedTask;
  setItem(TASKS_STORAGE_KEY, tasks);
  return updatedTask;
}

export function deleteTask(id: string): boolean {
  const tasks = getAllTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  setItem(TASKS_STORAGE_KEY, tasks);
  return true;
}

export function getProjects(): Project[] {
  return getItem<Project[]>(PROJECTS_STORAGE_KEY, SEED_PROJECTS);
}

export function createProject(name: string, description: string = ''): Project {
  const projects = getProjects();
  const now = new Date().toISOString();
  const newProject: Project = {
    id: generateId('proj'),
    name,
    description,
    createdAt: now,
  };
  const updatedProjects = [...projects, newProject];
  setItem(PROJECTS_STORAGE_KEY, updatedProjects);
  return newProject;
}
