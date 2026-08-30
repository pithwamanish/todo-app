import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateCompletion, AICompletionResult } from './router';

describe('AI Provider Model Gateway (router.ts)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('defaults to mock provider when no provider or environment key is specified', async () => {
    const result: AICompletionResult = await generateCompletion('Help me format this task');
    expect(result.provider).toBe('mock');
    expect(typeof result.text).toBe('string');
    expect(result.text).toBe(result.text.trim());
  });

  it('automatically falls back to mock provider when OpenAI key is missing', async () => {
    const result = await generateCompletion('Extract task info', {
      provider: 'openai',
    });
    expect(result.provider).toBe('mock');
    expect(result.text).toBeDefined();
  });

  it('automatically falls back to mock provider when Anthropic key is missing', async () => {
    const result = await generateCompletion('Extract task info', {
      provider: 'anthropic',
    });
    expect(result.provider).toBe('mock');
  });

  it('routes to requested provider when API key is explicitly passed', async () => {
    const result = await generateCompletion('Test prompt', {
      provider: 'openai',
      apiKey: 'sk-test-key-12345',
    });
    expect(result.provider).toBe('openai');
    expect(result.text).toBeDefined();
  });

  it('catches local endpoint network errors and gracefully falls back to mock', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error connecting to local LLM'))
    );

    const result = await generateCompletion('Local query', {
      provider: 'local',
    });
    expect(result.provider).toBe('mock');
    expect(result.text).toBeDefined();
  });

  it('trims leading and trailing whitespace from completion outputs', async () => {
    const result = await generateCompletion('  \n  Task prompt text \n ');
    expect(result.text).toBe(result.text.trim());
  });
});
