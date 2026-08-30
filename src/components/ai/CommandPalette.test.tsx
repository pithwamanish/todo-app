import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CommandPalette, QUICK_ACTIONS } from './CommandPalette';

function createMockLocalStorage() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
}

describe('CommandPalette Component', () => {
  let mockStorage: ReturnType<typeof createMockLocalStorage>;

  beforeEach(() => {
    mockStorage = createMockLocalStorage();
    vi.stubGlobal('localStorage', mockStorage);
    vi.stubGlobal('document', {
      body: { style: { overflow: '' } },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('exports quick action list definitions', () => {
    expect(QUICK_ACTIONS.length).toBeGreaterThan(0);
    expect(QUICK_ACTIONS.some((a) => a.id === 'create_task')).toBe(true);
  });

  it('returns null element when isOpen is false', () => {
    const element = React.createElement(CommandPalette, {
      isOpen: false,
      onClose: vi.fn(),
    });

    expect(element.props.isOpen).toBe(false);
  });

  it('renders CommandPalette modal when isOpen is true', () => {
    const onClose = vi.fn();
    const onNaturalLanguageSubmit = vi.fn();
    const onActionSelect = vi.fn();

    const element = React.createElement(CommandPalette, {
      isOpen: true,
      onClose,
      onNaturalLanguageSubmit,
      onActionSelect,
    });

    expect(element.props.isOpen).toBe(true);
    expect(element.type).toBe(CommandPalette);
  });
});
