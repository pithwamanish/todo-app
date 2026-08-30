import { TaskPriority } from '@/types';
import { generateCompletion } from './router';

export interface ParsedTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string | null;
  projectName: string | null;
}

export function stripMarkdownFences(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned.trim();
}

export function parseWithRegex(input: string): ParsedTaskInput {
  let workingText = input.trim();

  // Priority detection
  let priority: TaskPriority = 'medium';
  if (/(!urgent|p0)/i.test(workingText)) {
    priority = 'urgent';
    workingText = workingText.replace(/(!urgent|p0)/gi, '');
  } else if (/(!high|p1)/i.test(workingText)) {
    priority = 'high';
    workingText = workingText.replace(/(!high|p1)/gi, '');
  } else if (/(!medium|p2)/i.test(workingText)) {
    priority = 'medium';
    workingText = workingText.replace(/(!medium|p2)/gi, '');
  } else if (/(!low|p3)/i.test(workingText)) {
    priority = 'low';
    workingText = workingText.replace(/(!low|p3)/gi, '');
  }

  // Project tag detection (#project)
  let projectName: string | null = null;
  const projectMatch = workingText.match(/#([a-zA-Z0-9_-]+)/);
  if (projectMatch) {
    projectName = projectMatch[1];
    workingText = workingText.replace(/#([a-zA-Z0-9_-]+)/g, '');
  }

  // Relative due date parsing
  let dueDate: string | null = null;
  const now = new Date();

  if (/\btoday\b/i.test(workingText)) {
    dueDate = now.toISOString();
    workingText = workingText.replace(/\btoday\b/gi, '');
  } else if (/\btomorrow\b/i.test(workingText)) {
    const tmrw = new Date(now);
    tmrw.setDate(tmrw.getDate() + 1);
    dueDate = tmrw.toISOString();
    workingText = workingText.replace(/\btomorrow\b/gi, '');
  } else if (/\bnext monday\b/i.test(workingText)) {
    const nextMon = new Date(now);
    const day = nextMon.getDay();
    const diff = (8 - day) % 7 || 7;
    nextMon.setDate(nextMon.getDate() + diff);
    dueDate = nextMon.toISOString();
    workingText = workingText.replace(/\bnext monday\b/gi, '');
  }

  const cleanTitle = workingText.replace(/\s+/g, ' ').trim() || input.trim();

  return {
    title: cleanTitle,
    priority,
    dueDate,
    projectName,
  };
}

export async function parseTaskFromInput(input: string): Promise<ParsedTaskInput | null> {
  if (!input || !input.trim()) {
    return null;
  }

  const prompt = `Parse the following user task input into a JSON object with keys "title" (string), "priority" ("low"|"medium"|"high"|"urgent"), "dueDate" (ISO string or null), and "projectName" (string or null): "${input}"`;

  try {
    const completion = await generateCompletion(prompt);
    const cleanedText = stripMarkdownFences(completion.text);

    const parsed = JSON.parse(cleanedText) as Partial<ParsedTaskInput>;
    if (parsed && typeof parsed.title === 'string' && parsed.title.trim()) {
      return {
        title: parsed.title.trim(),
        description: parsed.description || '',
        priority: ['low', 'medium', 'high', 'urgent'].includes(parsed.priority || '')
          ? (parsed.priority as TaskPriority)
          : 'medium',
        dueDate: parsed.dueDate || null,
        projectName: parsed.projectName || null,
      };
    }
  } catch {
    // Fall back to regex parser on JSON parse exception
  }

  return parseWithRegex(input);
}
