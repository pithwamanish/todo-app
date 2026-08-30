import { describe, expect, it } from 'vitest';
import {
  createMockAuditLog,
  createMockProject,
  createMockSubtask,
  createMockTask,
  isSubtask,
  isTask,
  isTaskPriority,
  isTaskStatus,
} from './index';

describe('TaskStatus Type Guard', () => {
  it('should return true for valid status values', () => {
    expect(isTaskStatus('todo')).toBe(true);
    expect(isTaskStatus('in_progress')).toBe(true);
    expect(isTaskStatus('review')).toBe(true);
    expect(isTaskStatus('done')).toBe(true);
  });

  it('should return false for invalid status values, null, or undefined', () => {
    expect(isTaskStatus('invalid')).toBe(false);
    expect(isTaskStatus('TODO')).toBe(false);
    expect(isTaskStatus('')).toBe(false);
    expect(isTaskStatus(null)).toBe(false);
    expect(isTaskStatus(undefined)).toBe(false);
    expect(isTaskStatus(123)).toBe(false);
    expect(isTaskStatus({})).toBe(false);
  });
});

describe('TaskPriority Type Guard', () => {
  it('should return true for valid priority values', () => {
    expect(isTaskPriority('low')).toBe(true);
    expect(isTaskPriority('medium')).toBe(true);
    expect(isTaskPriority('high')).toBe(true);
    expect(isTaskPriority('urgent')).toBe(true);
  });

  it('should return false for invalid priority values, null, or undefined', () => {
    expect(isTaskPriority('critical')).toBe(false);
    expect(isTaskPriority('HIGH')).toBe(false);
    expect(isTaskPriority('')).toBe(false);
    expect(isTaskPriority(null)).toBe(false);
    expect(isTaskPriority(undefined)).toBe(false);
    expect(isTaskPriority(456)).toBe(false);
    expect(isTaskPriority([])).toBe(false);
  });
});

describe('Subtask Type Guard', () => {
  it('should return true for valid Subtask objects', () => {
    const subtask = createMockSubtask();
    expect(isSubtask(subtask)).toBe(true);
  });

  it('should return false for invalid Subtask objects', () => {
    expect(isSubtask(null)).toBe(false);
    expect(isSubtask(undefined)).toBe(false);
    expect(isSubtask('not a subtask')).toBe(false);
    expect(isSubtask({ id: '1', title: 'Sub' })).toBe(false); // missing completed and createdAt
    expect(isSubtask({ id: '1', title: 'Sub', completed: 'yes', createdAt: '2026-01-01' })).toBe(false);
  });
});

describe('Task Type Guard', () => {
  it('should return true for a valid default task object', () => {
    const task = createMockTask();
    expect(isTask(task)).toBe(true);
  });

  it('should return true for tasks with non-null projectId, dueDate, and subtasks', () => {
    const task = createMockTask({
      projectId: 'proj-123',
      dueDate: '2026-12-31T23:59:59.000Z',
      subtasks: [createMockSubtask()],
    });
    expect(isTask(task)).toBe(true);
  });

  it('should return false for null, undefined, or primitives', () => {
    expect(isTask(null)).toBe(false);
    expect(isTask(undefined)).toBe(false);
    expect(isTask('string')).toBe(false);
    expect(isTask(100)).toBe(false);
  });

  it('should return false when required fields are missing or invalid type', () => {
    const base = createMockTask();

    expect(isTask({ ...base, id: 123 })).toBe(false);
    expect(isTask({ ...base, title: null })).toBe(false);
    expect(isTask({ ...base, description: undefined })).toBe(false);
    expect(isTask({ ...base, status: 'invalid_status' })).toBe(false);
    expect(isTask({ ...base, priority: 'super_high' })).toBe(false);
    expect(isTask({ ...base, projectId: 123 })).toBe(false);
    expect(isTask({ ...base, dueDate: 12345 })).toBe(false);
    expect(isTask({ ...base, createdAt: true })).toBe(false);
    expect(isTask({ ...base, updatedAt: {} })).toBe(false);
  });

  it('should return false when subtasks is not an array or contains an invalid subtask', () => {
    const base = createMockTask();

    expect(isTask({ ...base, subtasks: 'invalid' })).toBe(false);
    expect(isTask({ ...base, subtasks: [createMockSubtask(), { invalid: true }] })).toBe(false);
  });
});

describe('Mock Factory Helpers', () => {
  it('createMockSubtask creates default subtask and applies overrides', () => {
    const defaultSub = createMockSubtask();
    expect(defaultSub).toEqual({
      id: 'subtask-1',
      title: 'Default Subtask',
      completed: false,
      createdAt: '2026-01-01T00:00:00.000Z',
    });

    const customSub = createMockSubtask({ title: 'Custom Subtask', completed: true });
    expect(customSub.title).toBe('Custom Subtask');
    expect(customSub.completed).toBe(true);
    expect(customSub.id).toBe('subtask-1');
  });

  it('createMockTask creates default task and applies overrides', () => {
    const defaultTask = createMockTask();
    expect(defaultTask).toEqual({
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
    });

    const customTask = createMockTask({
      status: 'in_progress',
      priority: 'urgent',
      title: 'Urgent Work',
    });
    expect(customTask.status).toBe('in_progress');
    expect(customTask.priority).toBe('urgent');
    expect(customTask.title).toBe('Urgent Work');
    expect(isTask(customTask)).toBe(true);
  });

  it('createMockProject creates default project and applies overrides', () => {
    const defaultProject = createMockProject();
    expect(defaultProject).toEqual({
      id: 'project-1',
      name: 'Default Project',
      description: 'Default Project Description',
      createdAt: '2026-01-01T00:00:00.000Z',
    });

    const customProject = createMockProject({ name: 'Alpha Project' });
    expect(customProject.name).toBe('Alpha Project');
    expect(customProject.id).toBe('project-1');
  });

  it('createMockAuditLog creates default audit log and applies overrides', () => {
    const defaultLog = createMockAuditLog();
    expect(defaultLog).toEqual({
      id: 'audit-1',
      taskId: 'task-1',
      action: 'created',
      timestamp: '2026-01-01T00:00:00.000Z',
    });

    const customLog = createMockAuditLog({
      action: 'updated',
      details: { changedField: 'status', from: 'todo', to: 'done' },
    });
    expect(customLog.action).toBe('updated');
    expect(customLog.details).toEqual({ changedField: 'status', from: 'todo', to: 'done' });
  });
});
