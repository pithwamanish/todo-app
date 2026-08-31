import React from 'react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';

describe('HomePage Component', () => {
  it('instantiates HomePage element cleanly', () => {
    const element = React.createElement(HomePage);
    expect(element).toBeDefined();
    expect(element.type).toBe(HomePage);
  });
});


