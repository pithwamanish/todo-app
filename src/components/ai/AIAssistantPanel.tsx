'use client';

import React, { useState, useRef, useEffect } from 'react';
import { generateCompletion } from '@/lib/ai/router';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (input: string) => Promise<string> | string;
}

export const SUGGESTED_PROMPTS = [
  'Summarize overdue tasks',
  'Organize backlog',
  'Create sprint tasks',
  'Prioritize urgent items',
];

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  sender: 'assistant',
  text: 'Hello! I am your TaskFlow AI assistant. How can I help you manage your tasks today?',
  timestamp: '2026-01-01T00:00:00.000Z',
};

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  if (!isOpen) {
    return null;
  }

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isThinking) return;

    const now = new Date().toISOString();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) {
      setInputText('');
    }
    setIsThinking(true);

    try {
      let replyText = '';
      if (onSendMessage) {
        replyText = await onSendMessage(query);
      } else {
        const res = await generateCompletion(query);
        replyText = res.text;
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: replyText || 'TaskFlow AI assistant processed your request.',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        ...WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <aside
      role="dialog"
      aria-label="AI Assistant Panel"
      data-testid="ai-assistant-panel"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        borderLeft: '1px solid var(--border-color)',
        boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
        zIndex: 1500,
        isolation: 'isolate',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🤖</span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>AI Assistant</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleClearHistory}
            data-testid="clear-history-btn"
            title="Clear Chat History"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI panel"
            data-testid="ai-panel-close-btn"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div
        style={{
          padding: '10px 16px',
          backgroundColor: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
        }}
      >
        {SUGGESTED_PROMPTS.map((promptText, idx) => (
          <button
            key={idx}
            type="button"
            data-testid={`suggestion-chip-${idx}`}
            onClick={() => handleSend(promptText)}
            disabled={isThinking}
            style={{
              whiteSpace: 'nowrap',
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              cursor: isThinking ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Message Thread */}
      <div
        data-testid="messages-container"
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              data-testid={`chat-msg-${msg.id}`}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                backgroundColor: isUser ? 'var(--primary-color)' : 'var(--bg-tertiary)',
                color: isUser ? '#ffffff' : 'var(--text-primary)',
                fontSize: '0.875rem',
                lineHeight: 1.4,
              }}
            >
              {msg.text}
            </div>
          );
        })}

        {isThinking && (
          <div
            data-testid="typing-indicator"
            style={{
              alignSelf: 'flex-start',
              padding: '8px 14px',
              borderRadius: '12px 12px 12px 2px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              fontStyle: 'italic',
            }}
          >
            AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '8px',
          backgroundColor: 'var(--bg-secondary)',
        }}
      >
        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask AI assistant..."
          data-testid="ai-chat-input"
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            resize: 'none',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isThinking}
          data-testid="ai-send-btn"
          style={{
            padding: '0 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'var(--primary-color)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: !inputText.trim() || isThinking ? 'not-allowed' : 'pointer',
            opacity: !inputText.trim() || isThinking ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </div>
    </aside>
  );
};
