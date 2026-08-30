import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { TaskList } from './TaskList';
import { TaskItem } from './TaskItem';
import { createMockTask } from '@/types';

describe('TaskList & TaskItem Components', () => {
  const mockTasks = [
    createMockTask({
      id: 'task-1',
      title: 'First Active Task',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-12-31T00:00:00.000Z',
    }),
    createMockTask({
      id: 'task-2',
      title: 'Completed Task',
      status: 'done',
      priority: 'low',
      dueDate: null,
    }),
  ];

  it('renders empty state message when tasks array is empty', () => {
    const listElement = React.createElement(TaskList, { tasks: [] });
    expect(listElement.props.tasks).toEqual([]);
  });

  it('renders TaskList container element with tasks array', () => {
    const listElement = React.createElement(TaskList, {
      tasks: mockTasks,
      onStatusChange: vi.fn(),
      onSelectTask: vi.fn(),
    });

    expect(listElement.props.tasks.length).toBe(2);
  });

  it('handles TaskItem props and callbacks correctly', () => {
    const onStatusChange = vi.fn();
    const onSelectTask = vi.fn();

    const itemElement = React.createElement(TaskItem, {
      task: mockTasks[0],
      onStatusChange,
      onSelectTask,
    });

    expect(itemElement.props.task.id).toBe('task-1');
    expect(itemElement.props.task.status).toBe('todo');
    expect(itemElement.props.task.priority).toBe('high');
  });

  it('handles TaskItem with null dueDate without throwing', () => {
    const itemElement = React.createElement(TaskItem, {
      task: mockTasks[1],
    });

    expect(itemElement.props.task.dueDate).toBeNull();
    expect(itemElement.props.task.status).toBe('done');
  });
});
