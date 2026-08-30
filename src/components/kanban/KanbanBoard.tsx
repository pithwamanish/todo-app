'use client';

import React, { useState } from 'react';
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
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (colId: TaskStatus) => {
    if (dragOverColumn === colId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    const taskId = e.dataTransfer.getData('text/plain');
    const rawJson = e.dataTransfer.getData('application/json');
    let currentStatus: TaskStatus | null = null;

    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        currentStatus = parsed.status;
      } catch {
        // Ignore parse error
      }
    }

    if (!currentStatus) {
      const found = tasks.find((t) => t.id === taskId);
      currentStatus = found ? found.status : null;
    }

    // Edge Case: Dropping a card into its current column causes no state mutation
    if (currentStatus === targetStatus) {
      return;
    }

    if (taskId && onStatusChange) {
      onStatusChange(taskId, targetStatus);
    }
  };

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
        const isDraggedOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            data-testid={`kanban-column-${column.id}`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={() => handleDragLeave(column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            style={{
              backgroundColor: isDraggedOver ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '400px',
              border: isDraggedOver
                ? '2px solid var(--primary-color)'
                : '1px solid var(--border-color)',
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
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
