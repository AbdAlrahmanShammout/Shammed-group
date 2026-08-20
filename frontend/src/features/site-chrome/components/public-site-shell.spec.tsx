import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppRoutes } from '@/app/app-routes';
import { AuthSessionProvider } from '@/app/auth-session-provider';
import { appPaths } from '@/config/app-paths';
import { createQueryClient } from '@/config/query-client';
import {
  createPublicChromeFetchMock,
  hardcodedCompanyEmail,
  mockPublicContactEmail,
  mockPublicSiteSettings,
} from '@/test/public-chrome';

function renderPublicHome(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[appPaths.home]}>
        <AuthSessionProvider>
          <AppRoutes />
        </AuthSessionProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PublicSiteShell', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(createPublicChromeFetchMock()));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('renders nav links and footer contact details from the public APIs', async () => {
    const user = userEvent.setup();
    renderPublicHome();
    const primaryNav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(primaryNav).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: 'About Us' })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: 'Partners' })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: 'Services' })).toBeInTheDocument();
    expect(within(primaryNav).getByRole('link', { name: 'Contact Us' })).toBeInTheDocument();
    const contact = screen.getByRole('region', { name: 'Contact' });
    expect(await within(contact).findByRole('link', { name: mockPublicContactEmail })).toHaveAttribute(
      'href',
      `mailto:${mockPublicContactEmail}`,
    );
    expect(screen.queryByText(hardcodedCompanyEmail)).not.toBeInTheDocument();
    expect(await screen.findAllByRole('link', { name: mockPublicSiteSettings.companyName })).not.toHaveLength(0);
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/example',
    );
    expect(
      await screen.findByTitle('Google Map for Damascus Headquarters'),
    ).toHaveAttribute(
      'src',
      'https://maps.google.com/maps?q=33.52353,36.29287&z=15&output=embed',
    );
    const secondBranchTab = await screen.findByRole('tab', { name: 'Damascus Second Branch' });
    await user.click(secondBranchTab);
    expect(screen.getByTitle('Google Map for Damascus Second Branch')).toHaveAttribute(
      'src',
      'https://maps.google.com/maps?q=33.52178,36.29788&z=15&output=embed',
    );
  });
  it('keeps navigation when site settings fail and does not invent an email', async () => {
    vi.stubGlobal('fetch', vi.fn(createPublicChromeFetchMock({ failSiteSettings: true })));
    renderPublicHome();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(await screen.findByText('Contact details are unavailable.')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: mockPublicContactEmail })).not.toBeInTheDocument();
    expect(screen.queryByText(hardcodedCompanyEmail)).not.toBeInTheDocument();
  });
});
