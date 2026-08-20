import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/app/app';
import { createPublicChromeFetchMock, mockPublicHomePage } from '@/test/public-chrome';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(createPublicChromeFetchMock()));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('renders the public home heading inside the site chrome', async () => {
    render(<App />);
    expect(
      await screen.findByRole('heading', { name: mockPublicHomePage.homePage.heroTitle }),
    ).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });
});
