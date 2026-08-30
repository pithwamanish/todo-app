import { Task, TaskStatus, TaskPriority } from '@/types';
import {
  getAllTasks,
  getTasksByStatus,
  createTask,
  updateTask,
  deleteTask,
} from '@/lib/db/repository';

export interface AIToolCall {
  name: string;
  arguments: Record<string, unknown>;
  confirmed?: boolean;
}

export interface ToolResult {
  success: boolean;
  message: string;
  data?: unknown;
  requiresConfirmation?: boolean;
}

export interface AIToolSchema {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  requiresConfirmation?: boolean;
}

export const TOOL_SCHEMAS: AIToolSchema[] = [
  {
    name: 'create_task',
    description: 'Create a new task with title, description, priority, and optional due date',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title' },
        description: { type: 'string', description: 'Task description' },
        priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
        dueDate: { type: 'string', description: 'ISO date string' },
      },
      required: ['title'],
    },
  },
  {
    name: 'update_task_status',
    description: 'Update the status of an existing task',
    parameters: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Task ID' },
        status: { type: 'string', enum: ['todo', 'in_progress', 'review', 'done'] },
      },
      required: ['taskId', 'status'],
    },
  },
  {
    name: 'filter_tasks',
    description: 'Filter tasks by status, priority, or query substring',
    parameters: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        priority: { type: 'string' },
        search: { type: 'string' },
      },
    },
  },
  {
    name: 'delete_completed',
    description: 'Delete all completed tasks (status: done)',
    parameters: {
      type: 'object',
      properties: {},
    },
    requiresConfirmation: true,
  },
];

export async function executeToolCall(toolCall: AIToolCall): Promise<ToolResult> {
  try {
    switch (toolCall.name) {
      case 'create_task': {
        const title = toolCall.arguments.title as string;
        if (!title || typeof title !== 'string' || !title.trim()) {
          return {
            success: false,
            message: 'Invalid parameters: title is required and must be a non-empty string.',
          };
        }

        const newTask = createTask({
          title: title.trim(),
          description: (toolCall.arguments.description as string) || '',
          status: 'todo',
          priority: (toolCall.arguments.priority as TaskPriority) || 'medium',
          projectId: null,
          subtasks: [],
          dueDate: (toolCall.arguments.dueDate as string) || null,
        });

        return {
          success: true,
          message: `Task "${newTask.title}" created successfully.`,
          data: newTask,
        };
      }

      case 'update_task_status': {
        const taskId = toolCall.arguments.taskId as string;
        const status = toolCall.arguments.status as TaskStatus;

        if (!taskId || !status) {
          return {
            success: false,
            message: 'Invalid parameters: taskId and status are required.',
          };
        }

        const updated = updateTask(taskId, { status });
        if (!updated) {
          return {
            success: false,
            message: `Task with ID "${taskId}" not found.`,
          };
        }

        return {
          success: true,
          message: `Task status updated to "${updated.status}".`,
          data: updated,
        };
      }

      case 'filter_tasks': {
        let tasks = getAllTasks();
        const status = toolCall.arguments.status as TaskStatus;
        const search = (toolCall.arguments.search as string)?.toLowerCase();

        if (status) {
          tasks = tasks.filter((t) => t.status === status);
        }
        if (search) {
          tasks = tasks.filter(
            (t) => t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search)
          );
        }

        return {
          success: true,
          message: `Found ${tasks.length} matching tasks.`,
          data: tasks,
        };
      }

      case 'delete_completed': {
        // Destructive action confirmation guard
        if (!toolCall.confirmed) {
          return {
            success: false,
            requiresConfirmation: true,
            message: 'Deleting completed tasks requires confirmation. Please confirm.',
          };
        }

        const completedTasks = getTasksByStatus('done');
        let count = 0;

        for (const task of completedTasks) {
          if (deleteTask(task.id)) {
            count++;
          }
        }

        return {
          success: true,
          message: `Successfully deleted ${count} completed tasks.`,
          data: { count },
        };
      }

      default: {
        return {
          success: false,
          message: `Unknown tool: "${toolCall.name}".`,
        };
      }
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Tool execution error';
    return {
      success: false,
      message: errorMsg,
    };
  }
}
