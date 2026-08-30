'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';

export interface TaskItemProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onSelectTask?: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange, onSelectTask }) => {
  const isCompleted = task.status === 'done';

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: TaskStatus = isCompleted ? 'todo' : 'done';
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  const handleRowClick = () => {
    if (onSelectTask) {
      onSelectTask(task.id);
    }
  };

  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return 'No due date';
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? 'No due date' : date.toLocaleDateString();
    } catch {
      return 'No due date';
    }
  };

  return (
    <div
      data-testid={`task-item-${task.id}`}
      onClick={handleRowClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        margin: '6px 0',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        gap: '12px',
      }}
    >
      {/* Checkbox & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => {}} // Controlled via onClick to stop propagation cleanly
          onClick={handleCheckboxClick}
          data-testid={`task-checkbox-${task.id}`}
          style={{
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            accentColor: 'var(--primary-color)',
          }}
        />
        <span
          style={{
            fontWeight: 500,
            fontSize: '0.95rem',
            color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: isCompleted ? 'line-through' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {task.title}
        </span>
      </div>

      {/* Badges & Due Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Status Badge */}
        <span
          data-testid={`task-status-${task.id}`}
          style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: `var(--status-${task.status}-bg)`,
            color: `var(--status-${task.status}-text)`,
            textTransform: 'capitalize',
          }}
        >
          {task.status.replace('_', ' ')}
        </span>

        {/* Priority Badge */}
        <span
          data-testid={`task-priority-${task.id}`}
          style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: `var(--priority-${task.priority}-bg)`,
            color: `var(--priority-${task.priority}-text)`,
            textTransform: 'capitalize',
          }}
        >
          {task.priority}
        </span>

        {/* Due Date */}
        <span
          data-testid={`task-duedate-${task.id}`}
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            minWidth: '80px',
            textAlign: 'right',
          }}
        >
          {formatDueDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
};
