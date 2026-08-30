import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import {
  filterAndSortTasks,
  TaskFilters,
  DEFAULT_FILTER_STATE,
} from './TaskFilters';
import { createMockTask, Task } from '@/types';

describe('TaskFilters & filterAndSortTasks', () => {
  const sampleTasks: Task[] = [
    createMockTask({
      id: '1',
      title: 'Alpha Design Docs',
      description: 'Write architectural specifications',
      status: 'in_progress',
      priority: 'urgent',
      dueDate: '2026-06-01T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
    }),
    createMockTask({
      id: '2',
      title: 'Beta Testing Suite',
      description: 'Add integration test cases',
      status: 'todo',
      priority: 'low',
      dueDate: null,
      createdAt: '2026-02-01T00:00:00.000Z',
    }),
    createMockTask({
      id: '3',
      title: 'Gamma Release Notes',
      description: 'Prepare changelog and release notes',
      status: 'done',
      priority: 'high',
      dueDate: '2026-04-01T00:00:00.000Z',
      createdAt: '2026-03-01T00:00:00.000Z',
    }),
  ];

  describe('filterAndSortTasks Pure Helper Function', () => {
    it('filters tasks by case-insensitive text search matching title or description', () => {
      const titleMatches = filterAndSortTasks(sampleTasks, {
        ...DEFAULT_FILTER_STATE,
        search: 'alpha',
      });
      expect(titleMatches.length).toBe(1);
      expect(titleMatches[0].id).toBe('1');

      const descMatches = filterAndSortTasks(sampleTasks, {
        ...DEFAULT_FILTER_STATE,
        search: 'changelog',
      });
      expect(descMatches.length).toBe(1);
      expect(descMatches[0].id).toBe('3');
    });

    it('filters tasks by status', () => {
      const inProgress = filterAndSortTasks(sampleTasks, {
        ...DEFAULT_FILTER_STATE,
        status: 'in_progress',
      });
      expect(inProgress.length).toBe(1);
      expect(inProgress[0].id).toBe('1');
    });

    it('filters tasks by priority', () => {
      const highPriority = filterAndSortTasks(sampleTasks, {
        ...DEFAULT_FILTER_STATE,
        priority: 'high',
      });
      expect(highPriority.length).toBe(1);
      expect(highPriority[0].id).toBe('3');
    });

    it('applies multi-criteria AND filtering simultaneously', () => {
      const multiFiltered = filterAndSortTasks(sampleTasks, {
        ...DEFAULT_FILTER_STATE,
        search: 'design',
        status: 'in_progress',
        priority: 'urgent',
      });
      expect(multiFiltered.length).toBe(1);
      expect(multiFiltered[0].id).toBe('1');

      const noMatch = filterAndSortTasks(sampleTasks, {
        ...DEFAULT_FILTER_STATE,
        search: 'nonexistentquery',
        status: 'done',
      });
      expect(noMatch.length).toBe(0);
    });

    it('sorts tasks by priority (urgent -> high -> medium -> low)', () => {
      const sortedByPriority = filterAndSortTasks(sampleTasks, {
        ...DEFAULT_FILTER_STATE,
        sortBy: 'priority',
      });
      expect(sortedByPriority.map((t) => t.priority)).toEqual(['urgent', 'high', 'low']);
    });

    it('sorts tasks by due date with null due dates at the end', () => {
      const sortedByDueDate = filterAndSortTasks(sampleTasks, {
        ...DEFAULT_FILTER_STATE,
        sortBy: 'dueDate',
      });
      expect(sortedByDueDate.map((t) => t.id)).toEqual(['3', '1', '2']);
    });

    it('sorts tasks alphabetically by title A-Z', () => {
      const sortedByTitle = filterAndSortTasks(sampleTasks, {
        ...DEFAULT_FILTER_STATE,
        sortBy: 'title',
      });
      expect(sortedByTitle.map((t) => t.title)).toEqual([
        'Alpha Design Docs',
        'Beta Testing Suite',
        'Gamma Release Notes',
      ]);
    });
  });

  describe('TaskFilters React Component', () => {
    it('renders TaskFilters element with filter state props', () => {
      const onFilterChange = vi.fn();
      const element = React.createElement(TaskFilters, {
        filters: DEFAULT_FILTER_STATE,
        onFilterChange,
      });

      expect(element.props.filters).toEqual(DEFAULT_FILTER_STATE);
      expect(element.type).toBe(TaskFilters);
    });
  });
});
