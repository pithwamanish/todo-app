'use client';

import React from 'react';
import { Project } from '@/types';

export interface SidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  viewMode: 'list' | 'kanban';
  onSelectViewMode: (mode: 'list' | 'kanban') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  viewMode,
  onSelectViewMode,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <aside
      data-testid="sidebar"
      style={{
        width: isCollapsed ? '68px' : '250px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Header & Collapse Toggle */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {!isCollapsed && (
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Workspace
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          data-testid="sidebar-toggle"
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            padding: '6px 10px',
            borderRadius: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* View Switcher Section */}
      <div
        style={{
          padding: isCollapsed ? '14px 8px' : '14px 16px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {!isCollapsed && (
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
            }}
          >
            Views
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: isCollapsed ? 'column' : 'row',
            gap: '6px',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: '8px',
          }}
        >
          <button
            type="button"
            data-testid="view-list-btn"
            onClick={() => onSelectViewMode('list')}
            style={{
              flex: 1,
              padding: '8px 10px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: viewMode === 'list' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'list' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: viewMode === 'list' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>📋</span>
            {!isCollapsed && <span>List</span>}
          </button>
          <button
            type="button"
            data-testid="view-kanban-btn"
            onClick={() => onSelectViewMode('kanban')}
            style={{
              flex: 1,
              padding: '8px 10px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: viewMode === 'kanban' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'kanban' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: viewMode === 'kanban' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: viewMode === 'kanban' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>📊</span>
            {!isCollapsed && <span>Kanban</span>}
          </button>
        </div>
      </div>

      {/* Navigation & Projects Section */}
      <nav
        style={{
          flex: 1,
          padding: isCollapsed ? '14px 8px' : '14px 16px',
          overflowY: 'auto',
        }}
      >
        <button
          type="button"
          data-testid="nav-all-tasks"
          onClick={() => onSelectProject(null)}
          style={{
            width: '100%',
            padding: '10px 12px',
            marginBottom: '14px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: selectedProjectId === null ? 'var(--bg-tertiary)' : 'transparent',
            color: selectedProjectId === null ? 'var(--primary-color)' : 'var(--text-primary)',
            fontWeight: selectedProjectId === null ? 700 : 500,
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '1.05rem' }}>📁</span>
          {!isCollapsed && <span>All Tasks</span>}
        </button>

        {!isCollapsed && (
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
            }}
          >
            Projects ({projects.length})
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {projects.map((proj) => {
            const isSelected = selectedProjectId === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                data-testid={`project-item-${proj.id}`}
                onClick={() => onSelectProject(proj.id)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                  color: isSelected ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.875rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>🏷️</span>
                {!isCollapsed && <span>{proj.name}</span>}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

