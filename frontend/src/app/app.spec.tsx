import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/app/app';
import { createPublicChromeFetchMock } from '@/test/public-chrome';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(createPublicChromeFetchMock()));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('renders the public home heading inside the site chrome', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });
});
