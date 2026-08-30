import { describe, it, expect } from 'vitest';
import {
  parseTaskFromInput,
  parseWithRegex,
  stripMarkdownFences,
  ParsedTaskInput,
} from './parser';

describe('Natural Language Task Parser (parser.ts)', () => {
  it('returns null when input is empty or whitespace only', async () => {
    expect(await parseTaskFromInput('')).toBeNull();
    expect(await parseTaskFromInput('   \n  ')).toBeNull();
  });

  it('strips markdown code block wrappers from JSON responses', () => {
    const rawJson = '```json\n{"title": "Test Task", "priority": "high"}\n```';
    expect(stripMarkdownFences(rawJson)).toBe('{"title": "Test Task", "priority": "high"}');
  });

  it('parses priority markers using regex fallback', () => {
    const resUrgent = parseWithRegex('Prepare pitch deck !urgent');
    expect(resUrgent.priority).toBe('urgent');
    expect(resUrgent.title).toBe('Prepare pitch deck');

    const resHigh = parseWithRegex('Deploy backend !high');
    expect(resHigh.priority).toBe('high');

    const resP1 = parseWithRegex('Fix critical bug p1');
    expect(resP1.priority).toBe('high');
  });

  it('parses project tags (#project)', () => {
    const res = parseWithRegex('Refactor auth module #backend !high');
    expect(res.projectName).toBe('backend');
    expect(res.priority).toBe('high');
    expect(res.title).toBe('Refactor auth module');
  });

  it('parses relative due date keywords (tomorrow, next Monday)', () => {
    const resTmrw = parseWithRegex('Finish report tomorrow');
    expect(resTmrw.dueDate).not.toBeNull();

    const resMonday = parseWithRegex('Weekly sync next Monday #general');
    expect(resMonday.dueDate).not.toBeNull();
    expect(resMonday.projectName).toBe('general');
  });

  it('defaults unspecified priority to medium and due date to null', () => {
    const res = parseWithRegex('Simple task without metadata');
    expect(res.priority).toBe('medium');
    expect(res.dueDate).toBeNull();
    expect(res.projectName).toBeNull();
  });

  it('executes parseTaskFromInput successfully and returns structured task input', async () => {
    const parsed: ParsedTaskInput | null = await parseTaskFromInput('Write docs !high #frontend tomorrow');
    expect(parsed).not.toBeNull();
    expect(parsed?.title).toBeDefined();
    expect(parsed?.priority).toBeDefined();
  });
});
