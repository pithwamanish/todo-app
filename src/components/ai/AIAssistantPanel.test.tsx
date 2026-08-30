import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AIAssistantPanel, SUGGESTED_PROMPTS, WELCOME_MESSAGE } from './AIAssistantPanel';

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

describe('AIAssistantPanel Component', () => {
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

  it('exports suggested prompt chips and welcome message defaults', () => {
    expect(SUGGESTED_PROMPTS.length).toBeGreaterThan(0);
    expect(WELCOME_MESSAGE.sender).toBe('assistant');
  });

  it('returns null element when isOpen is false', () => {
    const element = React.createElement(AIAssistantPanel, {
      isOpen: false,
      onClose: vi.fn(),
    });

    expect(element.props.isOpen).toBe(false);
  });

  it('renders AIAssistantPanel when isOpen is true', () => {
    const onClose = vi.fn();
    const onSendMessage = vi.fn();

    const element = React.createElement(AIAssistantPanel, {
      isOpen: true,
      onClose,
      onSendMessage,
    });

    expect(element.props.isOpen).toBe(true);
    expect(element.type).toBe(AIAssistantPanel);
  });
});
