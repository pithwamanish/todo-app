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

  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      data-testid={`task-item-${task.id}`}
      onClick={handleRowClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        margin: '8px 0',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.borderColor = 'var(--primary-color)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Checkbox & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => {}} // Controlled via onClick to stop propagation cleanly
          onClick={handleCheckboxClick}
          data-testid={`task-checkbox-${task.id}`}
          style={{
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            accentColor: 'var(--primary-color)',
            borderRadius: '4px',
          }}
        />
        <span
          style={{
            fontWeight: 600,
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

        {/* Subtask count badge */}
        {totalSubtasks > 0 && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
          >
            ☑ {completedSubtasks}/{totalSubtasks}
          </span>
        )}
      </div>

      {/* Badges & Due Date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Status Badge */}
        <span
          data-testid={`task-status-${task.id}`}
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: `var(--status-${task.status}-bg)`,
            color: `var(--status-${task.status}-text)`,
            textTransform: 'capitalize',
            letterSpacing: '0.02em',
          }}
        >
          {task.status.replace('_', ' ')}
        </span>

        {/* Priority Badge */}
        <span
          data-testid={`task-priority-${task.id}`}
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: `var(--priority-${task.priority}-bg)`,
            color: `var(--priority-${task.priority}-text)`,
            textTransform: 'capitalize',
            letterSpacing: '0.02em',
          }}
        >
          {task.priority}
        </span>

        {/* Due Date */}
        <span
          data-testid={`task-duedate-${task.id}`}
          style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            minWidth: '85px',
            textAlign: 'right',
          }}
        >
          {formatDueDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
};
