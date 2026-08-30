export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string | null;
  subtasks: Subtask[];
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  taskId: string;
  action: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

// Type Guards

export function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === 'string' &&
    ['todo', 'in_progress', 'review', 'done'].includes(value)
  );
}

export function isTaskPriority(value: unknown): value is TaskPriority {
  return (
    typeof value === 'string' &&
    ['low', 'medium', 'high', 'urgent'].includes(value)
  );
}

export function isSubtask(value: unknown): value is Subtask {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.completed === 'boolean' &&
    typeof candidate.createdAt === 'string'
  );
}

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    isTaskStatus(candidate.status) &&
    isTaskPriority(candidate.priority) &&
    (typeof candidate.projectId === 'string' || candidate.projectId === null) &&
    Array.isArray(candidate.subtasks) &&
    candidate.subtasks.every(isSubtask) &&
    (typeof candidate.dueDate === 'string' || candidate.dueDate === null) &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  );
}

// Mock Factories

export function createMockSubtask(overrides?: Partial<Subtask>): Subtask {
  return {
    id: 'subtask-1',
    title: 'Default Subtask',
    completed: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockTask(overrides?: Partial<Task>): Task {
  return {
    id: 'task-1',
    title: 'Default Task',
    description: 'Default Task Description',
    status: 'todo',
    priority: 'medium',
    projectId: null,
    subtasks: [],
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockProject(overrides?: Partial<Project>): Project {
  return {
    id: 'project-1',
    name: 'Default Project',
    description: 'Default Project Description',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockAuditLog(overrides?: Partial<AuditLog>): AuditLog {
  return {
    id: 'audit-1',
    taskId: 'task-1',
    action: 'created',
    timestamp: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}
