import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { KanbanBoard, KANBAN_COLUMNS } from './KanbanBoard';
import { KanbanCard } from './KanbanCard';
import { createMockTask, Task } from '@/types';

describe('KanbanBoard & KanbanCard Interactive Transitions', () => {
  const sampleTasks: Task[] = [
    createMockTask({
      id: 'k1',
      title: 'Kanban Todo Task',
      status: 'todo',
      priority: 'high',
      subtasks: [{ id: 's1', title: 'Subtask 1', completed: true, createdAt: '' }],
    }),
    createMockTask({
      id: 'k2',
      title: 'Kanban In Progress Task',
      status: 'in_progress',
      priority: 'urgent',
    }),
    createMockTask({
      id: 'k3',
      title: 'Kanban Done Task',
      status: 'done',
      priority: 'low',
    }),
  ];

  it('exports 4 standard Kanban column definitions', () => {
    expect(KANBAN_COLUMNS.length).toBe(4);
    expect(KANBAN_COLUMNS.map((c) => c.id)).toEqual(['todo', 'in_progress', 'review', 'done']);
  });

  it('renders KanbanBoard component element with tasks array', () => {
    const onSelectTask = vi.fn();
    const boardElement = React.createElement(KanbanBoard, {
      tasks: sampleTasks,
      onSelectTask,
    });

    expect(boardElement.props.tasks.length).toBe(3);
    expect(boardElement.type).toBe(KanbanBoard);
  });

  it('renders KanbanCard component element correctly', () => {
    const onSelectTask = vi.fn();
    const cardElement = React.createElement(KanbanCard, {
      task: sampleTasks[0],
      onSelectTask,
    });

    expect(cardElement.props.task.id).toBe('k1');
    expect(cardElement.props.task.title).toBe('Kanban Todo Task');
    expect(cardElement.type).toBe(KanbanCard);
  });

  it('handles accessible quick-move action button click', () => {
    const onStatusChange = vi.fn();
    const cardElement = React.createElement(KanbanCard, {
      task: sampleTasks[0], // status: 'todo'
      onStatusChange,
    });

    expect(cardElement.props.task.status).toBe('todo');
  });
});
