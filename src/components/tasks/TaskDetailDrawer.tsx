'use client';

import React, { useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, Subtask } from '@/types';
import { SubtaskChecklist } from './SubtaskChecklist';

export interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !task) {
    return null;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { title: e.target.value });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { description: e.target.value });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { status: e.target.value as TaskStatus });
    }
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { priority: e.target.value as TaskPriority });
    }
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdateTask) {
      const val = e.target.value ? new Date(e.target.value).toISOString() : null;
      onUpdateTask(task.id, { dueDate: val });
    }
  };

  const handleSubtasksChange = (newSubtasks: Subtask[]) => {
    if (onUpdateTask) {
      onUpdateTask(task.id, { subtasks: newSubtasks });
    }
  };

  const handleDelete = () => {
    if (onDeleteTask) {
      onDeleteTask(task.id);
    }
    onClose();
  };

  const formattedDueDate = task.dueDate ? task.dueDate.split('T')[0] : '';

  return (
    <div
      data-testid="drawer-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        isolation: 'isolate',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Task Detail Drawer"
        data-testid="drawer-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
          overflowY: 'auto',
          padding: '24px',
          zIndex: 1001,
          position: 'relative',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Task Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            data-testid="drawer-close-btn"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          {/* Title Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              Title
            </label>
            <input
              type="text"
              value={task.title}
              onChange={handleTitleChange}
              data-testid="drawer-title-input"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              Description
            </label>
            <textarea
              rows={4}
              value={task.description}
              onChange={handleDescriptionChange}
              data-testid="drawer-description-input"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Status & Priority Row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Status
              </label>
              <select
                value={task.status}
                onChange={handleStatusChange}
                data-testid="drawer-status-select"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}
              >
                Priority
              </label>
              <select
                value={task.priority}
                onChange={handlePriorityChange}
                data-testid="drawer-priority-select"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Due Date Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              Due Date
            </label>
            <input
              type="date"
              value={formattedDueDate}
              onChange={handleDueDateChange}
              data-testid="drawer-duedate-input"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Subtask Checklist */}
          <SubtaskChecklist
            subtasks={task.subtasks || []}
            onSubtasksChange={handleSubtasksChange}
          />
        </div>

        {/* Footer Actions */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleDelete}
            data-testid="drawer-delete-btn"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--priority-urgent-bg)',
              color: 'var(--priority-urgent-text)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
};
