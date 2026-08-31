'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Project } from '@/types';
import { getProjects } from '@/lib/db/repository';

export interface AppShellProps {
  children: React.ReactNode;
  projects?: Project[];
  activeView?: 'list' | 'kanban';
  onViewModeChange?: (mode: 'list' | 'kanban') => void;
  selectedProjectId?: string | null;
  onSelectProject?: (id: string | null) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  projects: initialProjects,
  activeView = 'list',
  onViewModeChange,
  selectedProjectId: initialSelectedProjectId = null,
  onSelectProject: externalOnSelectProject,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>(activeView);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialSelectedProjectId);
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects || []);

  useEffect(() => {
    if (!initialProjects || initialProjects.length === 0) {
      setProjectsList(getProjects());
    } else {
      setProjectsList(initialProjects);
    }
  }, [initialProjects]);

  // Mobile / Narrow viewport auto-collapse listener (<768px)
  useEffect(() => {
    function handleResize() {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    }
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleSelectViewMode = (mode: 'list' | 'kanban') => {
    setViewMode(mode);
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  const handleSelectProject = (id: string | null) => {
    setSelectedProjectId(id);
    if (externalOnSelectProject) {
      externalOnSelectProject(id);
    }
  };

  return (
    <div
      data-testid="app-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Navigation Header */}
      <header
        data-testid="header-bar"
        className="glass-panel"
        style={{
          height: '60px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          zIndex: 10,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            className="gradient-text"
            style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}
          >
            ✨ TaskFlow AI
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container with Sidebar & Viewport */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          projects={projectsList}
          selectedProjectId={selectedProjectId}
          onSelectProject={handleSelectProject}
          viewMode={viewMode}
          onSelectViewMode={handleSelectViewMode}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />

        {/* Viewport content */}
        <main
          data-testid="main-viewport"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px',
            backgroundColor: 'var(--bg-primary)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

