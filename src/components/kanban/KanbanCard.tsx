'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';

export interface KanbanCardProps {
  task: Task;
  onSelectTask?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

const NEXT_STATUS_MAP: Record<TaskStatus, TaskStatus> = {
  todo: 'in_progress',
  in_progress: 'review',
  review: 'done',
  done: 'todo',
};

export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onSelectTask, onStatusChange }) => {
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  const handleClick = () => {
    if (onSelectTask) {
      onSelectTask(task.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: task.id, status: task.status })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleQuickMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      const nextStatus = NEXT_STATUS_MAP[task.status];
      onStatusChange(task.id, nextStatus);
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
      data-testid={`kanban-card-${task.id}`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '12px 14px',
        marginBottom: '10px',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'grab',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Title & Quick Move Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <h4
          data-testid={`kanban-title-${task.id}`}
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
            flex: 1,
          }}
          title={task.title}
        >
          {task.title}
        </h4>

        {/* Accessible Quick Status Move Action */}
        <button
          type="button"
          data-testid={`quick-move-btn-${task.id}`}
          onClick={handleQuickMove}
          title={`Move to ${NEXT_STATUS_MAP[task.status].replace('_', ' ')}`}
          aria-label={`Move task ${task.title} to ${NEXT_STATUS_MAP[task.status].replace('_', ' ')}`}
          style={{
            border: 'none',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          →
        </button>
      </div>

      {/* Description Preview if present */}
      {task.description && (
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            margin: 0,
          }}
        >
          {task.description}
        </p>
      )}

      {/* Meta Footer: Priority, Subtasks, Due Date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '4px',
          fontSize: '0.75rem',
        }}
      >
        {/* Priority Badge */}
        <span
          data-testid={`kanban-priority-${task.id}`}
          style={{
            padding: '2px 8px',
            borderRadius: '10px',
            fontWeight: 600,
            backgroundColor: `var(--priority-${task.priority}-bg)`,
            color: `var(--priority-${task.priority}-text)`,
            textTransform: 'capitalize',
          }}
        >
          {task.priority}
        </span>

        {/* Subtask & Due Date info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
          {totalSubtasks > 0 && (
            <span data-testid={`kanban-subtasks-${task.id}`}>
              ☑ {completedSubtasks}/{totalSubtasks}
            </span>
          )}
          <span>{formatDueDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );
};
