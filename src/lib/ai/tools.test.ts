import { describe, it, expect, beforeEach, vi } from 'vitest';
import { executeToolCall, TOOL_SCHEMAS, ToolResult } from './tools';
import { getAllTasks, createTask, getTasksByStatus } from '@/lib/db/repository';

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
  };
}

describe('AI Function Calling & Tools (tools.ts)', () => {
  let mockStorage: ReturnType<typeof createMockLocalStorage>;

  beforeEach(() => {
    mockStorage = createMockLocalStorage();
    vi.stubGlobal('localStorage', mockStorage);
    vi.stubGlobal('window', { localStorage: mockStorage });
  });

  it('exports TOOL_SCHEMAS definitions for all supported tools', () => {
    expect(TOOL_SCHEMAS.length).toBe(4);
    expect(TOOL_SCHEMAS.map((t) => t.name)).toContain('create_task');
    expect(TOOL_SCHEMAS.map((t) => t.name)).toContain('delete_completed');
  });

  it('executes create_task tool and creates task in repository', async () => {
    const result: ToolResult = await executeToolCall({
      name: 'create_task',
      arguments: {
        title: 'New AI Tool Task',
        priority: 'high',
      },
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain('New AI Tool Task');
    expect(result.data).toBeDefined();

    const tasks = getAllTasks();
    expect(tasks.some((t) => t.title === 'New AI Tool Task')).toBe(true);
  });

  it('executes update_task_status tool', async () => {
    const task = createTask({
      title: 'Task to update',
      description: '',
      status: 'todo',
      priority: 'low',
      projectId: null,
      subtasks: [],
      dueDate: null,
    });

    const result = await executeToolCall({
      name: 'update_task_status',
      arguments: {
        taskId: task.id,
        status: 'done',
      },
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain('done');
  });

  it('requires confirmation before executing destructive delete_completed action', async () => {
    // Unconfirmed call
    const unconfirmedResult = await executeToolCall({
      name: 'delete_completed',
      arguments: {},
      confirmed: false,
    });

    expect(unconfirmedResult.success).toBe(false);
    expect(unconfirmedResult.requiresConfirmation).toBe(true);

    // Confirmed call
    const confirmedResult = await executeToolCall({
      name: 'delete_completed',
      arguments: {},
      confirmed: true,
    });

    expect(confirmedResult.success).toBe(true);
  });

  it('returns structured error result for unknown tool without throwing', async () => {
    const result = await executeToolCall({
      name: 'invalid_unknown_tool',
      arguments: {},
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Unknown tool');
  });
});
