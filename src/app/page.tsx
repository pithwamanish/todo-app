'use client';

import React from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AppShell } from '@/components/layout/AppShell';

export default function HomePage() {
  return (
    <ThemeProvider>
      <AppShell>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            AI TODO &amp; Work Management Platform
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Organize tasks, track projects, and leverage AI features.
          </p>
        </div>
      </AppShell>
    </ThemeProvider>
  );
}
