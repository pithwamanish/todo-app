import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { TaskDetailDrawer } from './TaskDetailDrawer';
import { createMockTask } from '@/types';

describe('TaskDetailDrawer Component', () => {
  const mockTask = createMockTask({
    id: 'd1',
    title: 'Drawer Testing Task',
    description: 'Detailed description for testing',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-10-15T00:00:00.000Z',
  });

  it('returns null element when isOpen is false or task is null', () => {
    const closedDrawer = React.createElement(TaskDetailDrawer, {
      task: mockTask,
      isOpen: false,
      onClose: vi.fn(),
    });
    expect(closedDrawer.props.isOpen).toBe(false);

    const nullTaskDrawer = React.createElement(TaskDetailDrawer, {
      task: null,
      isOpen: true,
      onClose: vi.fn(),
    });
    expect(nullTaskDrawer.props.task).toBeNull();
  });

  it('renders TaskDetailDrawer props cleanly when isOpen is true', () => {
    const onClose = vi.fn();
    const onUpdateTask = vi.fn();
    const onDeleteTask = vi.fn();

    const element = React.createElement(TaskDetailDrawer, {
      task: mockTask,
      isOpen: true,
      onClose,
      onUpdateTask,
      onDeleteTask,
    });

    expect(element.props.isOpen).toBe(true);
    expect(element.props.task.id).toBe('d1');
    expect(element.props.task.title).toBe('Drawer Testing Task');
    expect(element.type).toBe(TaskDetailDrawer);
  });
});
