import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/app/app';

describe('App', () => {
  it('renders the application title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Shammed Group' })).toBeInTheDocument();
  });
});
