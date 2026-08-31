'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AppShell } from '@/components/layout/AppShell';
import { TaskList } from '@/components/tasks/TaskList';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { TaskFilters, DEFAULT_FILTER_STATE, FilterState, filterAndSortTasks } from '@/components/tasks/TaskFilters';
import { TaskDetailDrawer } from '@/components/tasks/TaskDetailDrawer';
import { CommandPalette } from '@/components/ai/CommandPalette';
import { AIAssistantPanel } from '@/components/ai/AIAssistantPanel';
import { Task, TaskStatus, Project } from '@/types';
import {
  getAllTasks,
  getProjects,
  createTask,
  updateTask,
  deleteTask,
} from '@/lib/db/repository';
import { parseTaskFromInput } from '@/lib/ai/parser';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Initial data loading from client-side storage
  const reloadData = useCallback(() => {
    setTasks(getAllTasks());
    setProjects(getProjects());
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Handle Quick Add Task from natural language input string
  const handleAddTask = async (inputText: string) => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    setIsAddingTask(true);
    try {
      const parsed = await parseTaskFromInput(trimmed);
      if (parsed) {
        let projectId = selectedProjectId;
        if (parsed.projectName) {
          const matched = projects.find(
            (p) => p.name.toLowerCase() === parsed.projectName?.toLowerCase()
          );
          if (matched) {
            projectId = matched.id;
          }
        }

        createTask({
          title: parsed.title,
          description: parsed.description || '',
          status: 'todo',
          priority: parsed.priority || 'medium',
          projectId: projectId || null,
          subtasks: [],
          dueDate: parsed.dueDate || null,
        });

        reloadData();
        setNewTaskInput('');
      }
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddTask(newTaskInput);
  };

  // Task mutations
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
    reloadData();
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates);
    reloadData();
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setSelectedTaskId(null);
    reloadData();
  };

  const handleActionSelect = (actionId: string) => {
    switch (actionId) {
      case 'create_task':
        const inputEl = document.getElementById('quick-task-input');
        inputEl?.focus();
        break;
      case 'view_list':
        setViewMode('list');
        break;
      case 'view_kanban':
        setViewMode('kanban');
        break;
      default:
        break;
    }
  };

  // Filter tasks per project and filter criteria
  const projectFilteredTasks = selectedProjectId
    ? tasks.filter((t) => t.projectId === selectedProjectId)
    : tasks;

  const visibleTasks = filterAndSortTasks(projectFilteredTasks, filters);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const handleOpenPalette = () => {
    setSelectedTaskId(null);
    setIsAIPanelOpen(false);
    setIsPaletteOpen(true);
  };

  const handleToggleAIPanel = () => {
    setIsAIPanelOpen((prev) => {
      if (!prev) {
        setSelectedTaskId(null);
        setIsPaletteOpen(false);
      }
      return !prev;
    });
  };

  const handleSelectTask = (taskId: string | null) => {
    if (taskId) {
      setIsPaletteOpen(false);
      setIsAIPanelOpen(false);
    }
    setSelectedTaskId(taskId);
  };

  return (
    <ThemeProvider>
      <AppShell
        projects={projects}
        activeView={viewMode}
        onViewModeChange={setViewMode}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                AI TODO &amp; Work Management Platform
              </h1>
              <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '0.95rem' }}>
                Organize tasks, track projects, and leverage AI features.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={handleOpenPalette}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>🔍</span> Command Palette <kbd style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>Cmd+K</kbd>
              </button>

              <button
                type="button"
                className="gradient-btn"
                onClick={handleToggleAIPanel}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🤖</span> AI Assistant
              </button>
            </div>
          </div>

          {/* Quick Task Creation Input Bar */}
          <form
            onSubmit={handleQuickAddSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '20px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                id="quick-task-input"
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add a task... (e.g. Prepare presentation !urgent #General tomorrow)"
                disabled={isAddingTask}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                }}
              />
              <button
                type="submit"
                className="gradient-btn"
                disabled={!newTaskInput.trim() || isAddingTask}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: !newTaskInput.trim() || isAddingTask ? 'not-allowed' : 'pointer',
                  opacity: !newTaskInput.trim() || isAddingTask ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {isAddingTask ? 'Adding...' : '➕ Add Task'}
              </button>
            </div>

            {/* Natural Language Syntax Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span style={{ fontWeight: 600 }}>Shortcuts:</span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--priority-urgent-bg)', color: 'var(--priority-urgent-text)', fontWeight: 600 }}>!urgent / !high / !medium</span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--primary-color)', fontWeight: 600 }}>#project</span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontWeight: 600 }}>today / tomorrow / next monday</span>
            </div>
          </form>

          {/* Search, Filter, and Sort Controls */}
          <TaskFilters filters={filters} onFilterChange={setFilters} />

          {/* Main Tasks View: List vs Kanban */}
          {viewMode === 'list' ? (
            <TaskList
              tasks={visibleTasks}
              onStatusChange={handleStatusChange}
              onSelectTask={handleSelectTask}
            />
          ) : (
            <KanbanBoard
              tasks={visibleTasks}
              onStatusChange={handleStatusChange}
              onSelectTask={handleSelectTask}
            />
          )}

          {/* Task Detail Drawer */}
          <TaskDetailDrawer
            task={selectedTask}
            isOpen={!!selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />

          {/* AI Floating Modals */}
          <CommandPalette
            isOpen={isPaletteOpen}
            onClose={() => setIsPaletteOpen(false)}
            onNaturalLanguageSubmit={handleAddTask}
            onActionSelect={handleActionSelect}
          />

          <AIAssistantPanel
            isOpen={isAIPanelOpen}
            onClose={() => setIsAIPanelOpen(false)}
          />
        </div>
      </AppShell>
    </ThemeProvider>
  );
}

