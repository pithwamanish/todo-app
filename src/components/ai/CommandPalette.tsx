'use client';

import React, { useState, useEffect } from 'react';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNaturalLanguageSubmit?: (input: string) => void;
  onActionSelect?: (actionId: string) => void;
}

export const QUICK_ACTIONS = [
  { id: 'create_task', label: 'Create Task', icon: '➕' },
  { id: 'view_list', label: 'Switch to List View', icon: '📋' },
  { id: 'view_kanban', label: 'Switch to Kanban View', icon: '📊' },
  { id: 'toggle_theme', label: 'Toggle Theme', icon: '🌓' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNaturalLanguageSubmit,
  onActionSelect,
}) => {
  const [query, setQuery] = useState('');

  // Lock background scroll when open
  useEffect(() => {
    if (typeof document !== 'undefined' && document.body) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined' && document.body) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K and Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && onNaturalLanguageSubmit) {
      onNaturalLanguageSubmit(trimmed);
      setQuery('');
      onClose();
    }
  };

  const handleActionClick = (actionId: string) => {
    if (onActionSelect) {
      onActionSelect(actionId);
    }
    onClose();
  };

  const filteredActions = QUICK_ACTIONS.filter((act) =>
    act.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div
      data-testid="command-palette-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(3px)',
        zIndex: 2000,
        isolation: 'isolate',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '15vh',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        data-testid="command-palette-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search / Prompt Input Form */}
        <form onSubmit={handleSubmit} style={{ margin: 0, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '1.3rem' }}>✨</span>
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or natural language task... (e.g. Write docs !high tomorrow)"
              data-testid="palette-input"
              style={{
                flex: 1,
                padding: '8px 0',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '1.05rem',
                outline: 'none',
                fontWeight: 500,
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-tertiary)',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
              }}
            >
              ESC
            </span>
          </div>
        </form>

        <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />

        {/* Quick Actions List */}
        <div style={{ padding: '12px', maxHeight: '320px', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              padding: '6px 12px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Quick Actions
          </div>
          {filteredActions.length === 0 ? (
            <div
              style={{
                padding: '16px 12px',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
              }}
            >
              Press Enter to submit as natural language task input
            </div>
          ) : (
            filteredActions.map((action) => (
              <button
                key={action.id}
                type="button"
                data-testid={`action-btn-${action.id}`}
                onClick={() => handleActionClick(action.id)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.925rem',
                  fontWeight: 500,
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{action.icon}</span>
                <span style={{ flex: 1 }}>{action.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
