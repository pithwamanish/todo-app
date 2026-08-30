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
        width: isCollapsed ? '64px' : '240px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 0.2s ease',
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
              fontSize: '1.1rem',
              color: 'var(--primary-color)',
            }}
          >
            Todo Workspace
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          data-testid="sidebar-toggle"
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* View Switcher Section */}
      <div
        style={{
          padding: isCollapsed ? '12px 8px' : '12px 16px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {!isCollapsed && (
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Views
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: isCollapsed ? 'column' : 'row',
            gap: '4px',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: '6px',
          }}
        >
          <button
            type="button"
            data-testid="view-list-btn"
            onClick={() => onSelectViewMode('list')}
            style={{
              flex: 1,
              padding: '6px 8px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: viewMode === 'list' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'list' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: viewMode === 'list' ? 600 : 400,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
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
              padding: '6px 8px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: viewMode === 'kanban' ? 'var(--bg-secondary)' : 'transparent',
              color: viewMode === 'kanban' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: viewMode === 'kanban' ? 600 : 400,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
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
          padding: isCollapsed ? '12px 8px' : '12px 16px',
          overflowY: 'auto',
        }}
      >
        <button
          type="button"
          data-testid="nav-all-tasks"
          onClick={() => onSelectProject(null)}
          style={{
            width: '100%',
            padding: '8px 12px',
            marginBottom: '12px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: selectedProjectId === null ? 'var(--bg-tertiary)' : 'transparent',
            color: selectedProjectId === null ? 'var(--primary-color)' : 'var(--text-primary)',
            fontWeight: selectedProjectId === null ? 600 : 400,
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
          }}
        >
          <span>📁</span>
          {!isCollapsed && <span>All Tasks</span>}
        </button>

        {!isCollapsed && (
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: '8px',
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
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                  color: isSelected ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
