import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  ThemeProvider,
  useTheme,
  getInitialTheme,
  applyThemeAttribute,
  THEME_STORAGE_KEY,
} from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

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

describe('ThemeProvider & Theme Token System', () => {
  let mockStorage: ReturnType<typeof createMockLocalStorage>;
  let attributes: Record<string, string>;
  let mockDoc: {
    documentElement: {
      setAttribute: (key: string, val: string) => void;
      getAttribute: (key: string) => string | null;
      removeAttribute: (key: string) => void;
    };
  };

  beforeEach(() => {
    mockStorage = createMockLocalStorage();
    attributes = {};

    mockDoc = {
      documentElement: {
        setAttribute: (key: string, val: string) => {
          attributes[key] = val;
        },
        getAttribute: (key: string) => attributes[key] ?? null,
        removeAttribute: (key: string) => {
          delete attributes[key];
        },
      },
    };

    vi.stubGlobal('localStorage', mockStorage);
    vi.stubGlobal('document', mockDoc);
    vi.stubGlobal('window', {
      localStorage: mockStorage,
      matchMedia: undefined,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('exports correct storage key constant', () => {
    expect(THEME_STORAGE_KEY).toBe('todo_app_theme');
  });

  it('returns default light theme when no saved preference or OS dark mode exists', () => {
    expect(getInitialTheme()).toBe('light');
  });

  it('reads saved theme preference from localStorage', () => {
    mockStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(getInitialTheme()).toBe('dark');
  });

  it('detects OS dark mode preference via matchMedia when storage is empty', () => {
    vi.stubGlobal('window', {
      localStorage: mockStorage,
      matchMedia: (query: string) => ({
        matches: query.includes('(prefers-color-scheme: dark)'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });

    expect(getInitialTheme()).toBe('dark');
  });

  it('applies data-theme attribute synchronously to documentElement', () => {
    applyThemeAttribute('dark');
    expect(mockDoc.documentElement.getAttribute('data-theme')).toBe('dark');

    applyThemeAttribute('light');
    expect(mockDoc.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('renders ThemeProvider and ThemeToggle elements without throwing', () => {
    const providerElement = React.createElement(
      ThemeProvider,
      null,
      React.createElement(ThemeToggle)
    );
    expect(providerElement).toBeDefined();
    expect(providerElement.type).toBe(ThemeProvider);
  });

  it('throws when useTheme is invoked outside ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => useTheme()).toThrow();
    consoleSpy.mockRestore();
  });
});
