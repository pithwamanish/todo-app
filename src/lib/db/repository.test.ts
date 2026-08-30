import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getAllTasks,
  getTaskById,
  getTasksByStatus,
  createTask,
  updateTask,
  deleteTask,
  getProjects,
  createProject,
  TASKS_STORAGE_KEY,
  PROJECTS_STORAGE_KEY,
  SEED_TASKS,
  SEED_PROJECTS,
} from './repository';

function createMockLocalStorage() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

describe('Task Repository Layer', () => {
  let mockStorage: ReturnType<typeof createMockLocalStorage>;

  beforeEach(() => {
    mockStorage = createMockLocalStorage();
    vi.stubGlobal('window', {
      localStorage: mockStorage,
    });
    vi.stubGlobal('localStorage', mockStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('Seed Data Population & Clear Storage', () => {
    it('populates initial seed tasks when localStorage is empty', () => {
      const tasks = getAllTasks();
      expect(tasks).toEqual(SEED_TASKS);
    });

    it('populates initial seed projects when localStorage is empty', () => {
      const projects = getProjects();
      expect(projects).toEqual(SEED_PROJECTS);
    });
  });

  describe('Tasks CRUD Operations', () => {
    it('retrieves task by ID', () => {
      const task = getTaskById('task-1');
      expect(task).not.toBeNull();
      expect(task?.id).toBe('task-1');
      expect(task?.title).toBe('Welcome to Todo App');
    });

    it('returns null for non-existent task ID', () => {
      const task = getTaskById('non-existent-id');
      expect(task).toBeNull();
    });

    it('retrieves tasks by status', () => {
      const todoTasks = getTasksByStatus('todo');
      expect(todoTasks.length).toBeGreaterThan(0);
      expect(todoTasks.every((t) => t.status === 'todo')).toBe(true);

      const doneTasks = getTasksByStatus('done');
      expect(doneTasks).toEqual([]);
    });

    it('creates a new task with generated ID and ISO timestamps', () => {
      const newTask = createTask({
        title: 'New Integration Test Task',
        description: 'Test Description',
        status: 'in_progress',
        priority: 'high',
        projectId: 'proj-1',
        subtasks: [],
        dueDate: null,
      });

      expect(newTask.id).toMatch(/^task-/);
      expect(newTask.title).toBe('New Integration Test Task');
      expect(newTask.status).toBe('in_progress');
      expect(newTask.createdAt).toBeDefined();
      expect(newTask.updatedAt).toBeDefined();

      const allTasks = getAllTasks();
      expect(allTasks.some((t) => t.id === newTask.id)).toBe(true);
    });

    it('updates an existing task and updates its updatedAt timestamp', () => {
      const original = getTaskById('task-1');
      expect(original).not.toBeNull();

      const updated = updateTask('task-1', {
        title: 'Updated Welcome Title',
        status: 'done',
      });

      expect(updated).not.toBeNull();
      expect(updated?.title).toBe('Updated Welcome Title');
      expect(updated?.status).toBe('done');
      expect(updated?.id).toBe('task-1');
      expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(original!.updatedAt).getTime()
      );

      const fetched = getTaskById('task-1');
      expect(fetched?.title).toBe('Updated Welcome Title');
    });

    it('returns null when attempting to update a non-existent task', () => {
      const result = updateTask('invalid-id', { title: 'No-op' });
      expect(result).toBeNull();
    });

    it('deletes an existing task and returns true', () => {
      const success = deleteTask('task-1');
      expect(success).toBe(true);
      expect(getTaskById('task-1')).toBeNull();
    });

    it('returns false cleanly when deleting a non-existent task ID', () => {
      const success = deleteTask('non-existent-task-id');
      expect(success).toBe(false);
    });
  });

  describe('Projects Operations', () => {
    it('creates a new project with defaults', () => {
      const newProj = createProject('Feature Roadmap', 'Q3 Roadmap Tasks');
      expect(newProj.id).toMatch(/^proj-/);
      expect(newProj.name).toBe('Feature Roadmap');
      expect(newProj.description).toBe('Q3 Roadmap Tasks');
      expect(newProj.createdAt).toBeDefined();

      const projects = getProjects();
      expect(projects.some((p) => p.id === newProj.id)).toBe(true);
    });
  });

  describe('Edge Cases: Data Corruption & SSR Safety', () => {
    it('resets storage to seed fallback when localStorage contains corrupt JSON', () => {
      mockStorage.setItem(TASKS_STORAGE_KEY, '{ invalid JSON content ');
      const tasks = getAllTasks();
      expect(tasks).toEqual(SEED_TASKS);

      mockStorage.setItem(PROJECTS_STORAGE_KEY, 'Not JSON');
      const projects = getProjects();
      expect(projects).toEqual(SEED_PROJECTS);
    });

    it('handles SSR environment safely when window or localStorage is undefined', () => {
      vi.stubGlobal('window', undefined);
      vi.stubGlobal('localStorage', undefined);

      expect(getAllTasks()).toEqual(SEED_TASKS);
      expect(getProjects()).toEqual(SEED_PROJECTS);
    });
  });
});
