'use client';

import React from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';

export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';

export interface FilterState {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  sortBy: SortOption;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
};

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function filterAndSortTasks(tasks: Task[], filters: FilterState): Task[] {
  return tasks
    .filter((task) => {
      // Text search matching against title and description
      if (filters.search.trim()) {
        const query = filters.search.trim().toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'priority': {
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        }
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1; // null due dates sorted to end
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        case 'title': {
          return a.title.localeCompare(b.title);
        }
        case 'createdAt':
        default: {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      }
    });
}

export interface TaskFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFilterChange }) => {
  const isFiltered =
    filters.search.trim() !== '' || filters.status !== 'all' || filters.priority !== 'all';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value as TaskStatus | 'all' });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, priority: e.target.value as TaskPriority | 'all' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as SortOption });
  };

  const handleClearFilters = () => {
    onFilterChange(DEFAULT_FILTER_STATE);
  };

  return (
    <div
      data-testid="task-filters"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        marginBottom: '16px',
      }}
    >
      {/* Text Search Input */}
      <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
          aria-label="Search tasks"
          data-testid="search-input"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Status Filter Dropdown */}
      <select
        value={filters.status}
        onChange={handleStatusChange}
        aria-label="Filter by status"
        data-testid="status-select"
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          cursor: 'pointer',
        }}
      >
        <option value="all">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>

      {/* Priority Filter Dropdown */}
      <select
        value={filters.priority}
        onChange={handlePriorityChange}
        aria-label="Filter by priority"
        data-testid="priority-select"
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          cursor: 'pointer',
        }}
      >
        <option value="all">All Priorities</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Sort By Dropdown */}
      <select
        value={filters.sortBy}
        onChange={handleSortChange}
        aria-label="Sort by"
        data-testid="sort-select"
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          cursor: 'pointer',
        }}
      >
        <option value="createdAt">Date Created</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="title">Title (A-Z)</option>
      </select>

      {/* Clear Filters Button */}
      {isFiltered && (
        <button
          type="button"
          onClick={handleClearFilters}
          data-testid="clear-filters-btn"
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
