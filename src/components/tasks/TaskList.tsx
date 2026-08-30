'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { TaskItem } from './TaskItem';

export interface TaskListProps {
  tasks: Task[];
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onSelectTask?: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onStatusChange, onSelectTask }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div
        data-testid="empty-task-list"
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px border var(--border-color)',
          borderRadius: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <p style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '6px' }}>No tasks found</p>
        <p style={{ fontSize: '0.875rem' }}>Create a new task or adjust your search filter.</p>
      </div>
    );
  }

  return (
    <div data-testid="task-list-container" style={{ display: 'flex', flexDirection: 'column' }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onSelectTask={onSelectTask}
        />
      ))}
    </div>
  );
};
