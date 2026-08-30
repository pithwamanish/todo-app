'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { KanbanCard } from './KanbanCard';

export interface KanbanBoardProps {
  tasks: Task[];
  onSelectTask?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

export const KANBAN_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'In Review' },
  { id: 'done', title: 'Done' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onSelectTask,
  onStatusChange,
}) => {
  return (
    <div
      data-testid="kanban-board"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        alignItems: 'start',
        width: '100%',
      }}
    >
      {KANBAN_COLUMNS.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);

        return (
          <div
            key={column.id}
            data-testid={`kanban-column-${column.id}`}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '400px',
              border: '1px solid var(--border-color)',
            }}
          >
            {/* Column Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                paddingBottom: '8px',
                borderBottom: '2px solid var(--border-color)',
              }}
            >
              <h3
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                {column.title}
              </h3>
              <span
                data-testid={`column-count-${column.id}`}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                }}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Task Cards or Empty Placeholder */}
            <div style={{ flex: 1 }}>
              {columnTasks.length === 0 ? (
                <div
                  data-testid={`empty-column-${column.id}`}
                  style={{
                    padding: '24px 12px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '6px',
                    marginTop: '8px',
                  }}
                >
                  No tasks in this column
                </div>
              ) : (
                columnTasks.map((task) => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    onSelectTask={onSelectTask}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
