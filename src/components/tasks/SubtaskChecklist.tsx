'use client';

import React, { useState } from 'react';
import { Subtask } from '@/types';

export interface SubtaskChecklistProps {
  subtasks: Subtask[];
  onSubtasksChange: (subtasks: Subtask[]) => void;
}

export const SubtaskChecklist: React.FC<SubtaskChecklistProps> = ({
  subtasks = [],
  onSubtasksChange,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const total = subtasks.length;
  const completed = subtasks.filter((s) => s.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleAddSubtask = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    const newSubtask: Subtask = {
      id: `subtask-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onSubtasksChange([...subtasks, newSubtask]);
    setNewTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    }
  };

  const handleToggleSubtask = (id: string) => {
    const updated = subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s));
    onSubtasksChange(updated);
  };

  const handleDeleteSubtask = (id: string) => {
    const updated = subtasks.filter((s) => s.id !== id);
    onSubtasksChange(updated);
  };

  return (
    <div
      data-testid="subtask-checklist"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '12px',
      }}
    >
      {/* Progress Header & Bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '6px',
          }}
        >
          <span>Subtasks</span>
          <span data-testid="subtask-progress-label">
            {completed} of {total} completed ({percentage}%)
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            data-testid="subtask-progress-bar"
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: 'var(--primary-color)',
              transition: 'width 0.2s ease',
            }}
          />
        </div>
      </div>

      {/* Existing Subtasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {subtasks.map((st) => (
          <div
            key={st.id}
            data-testid={`subtask-item-${st.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                flex: 1,
                fontSize: '0.875rem',
                textDecoration: st.completed ? 'line-through' : 'none',
                color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)',
              }}
            >
              <input
                type="checkbox"
                checked={st.completed}
                onChange={() => handleToggleSubtask(st.id)}
                data-testid={`subtask-checkbox-${st.id}`}
                style={{ cursor: 'pointer' }}
              />
              <span>{st.title}</span>
            </label>

            <button
              type="button"
              onClick={() => handleDeleteSubtask(st.id)}
              data-testid={`delete-subtask-${st.id}`}
              aria-label={`Delete subtask ${st.title}`}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '2px 6px',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add Subtask Input Form */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new subtask..."
          data-testid="add-subtask-input"
          style={{
            flex: 1,
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={handleAddSubtask}
          data-testid="add-subtask-btn"
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'var(--primary-color)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};
