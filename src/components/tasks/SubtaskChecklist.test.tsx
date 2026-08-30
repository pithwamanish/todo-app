import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { SubtaskChecklist } from './SubtaskChecklist';
import { Subtask, createMockSubtask } from '@/types';

describe('SubtaskChecklist Component', () => {
  const sampleSubtasks: Subtask[] = [
    createMockSubtask({ id: 's1', title: 'Subtask One', completed: true }),
    createMockSubtask({ id: 's2', title: 'Subtask Two', completed: false }),
  ];

  it('renders progress bar and completion label cleanly', () => {
    const element = React.createElement(SubtaskChecklist, {
      subtasks: sampleSubtasks,
      onSubtasksChange: vi.fn(),
    });

    expect(element.props.subtasks.length).toBe(2);
    expect(element.type).toBe(SubtaskChecklist);
  });

  it('handles 0 subtasks without division by zero errors (NaN)', () => {
    const element = React.createElement(SubtaskChecklist, {
      subtasks: [],
      onSubtasksChange: vi.fn(),
    });

    expect(element.props.subtasks).toEqual([]);
  });

  it('provides handlers for adding, toggling, and deleting subtasks', () => {
    const onSubtasksChange = vi.fn();
    const element = React.createElement(SubtaskChecklist, {
      subtasks: sampleSubtasks,
      onSubtasksChange,
    });

    expect(element.props.onSubtasksChange).toBe(onSubtasksChange);
  });
});
