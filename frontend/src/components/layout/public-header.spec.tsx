import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { PublicHeader } from '@/components/layout/public-header';
import { appPaths } from '@/config/app-paths';
import { publicNavItems } from '@/config/public-nav-items';

const navLabels = ['Home', 'About Us', 'Partners', 'Products', 'Services', 'Contact Us'] as const;

function renderHeader(): void {
  render(
    <MemoryRouter>
      <PublicHeader companyName="Example Company" homePath={appPaths.home} navItems={publicNavItems} />
    </MemoryRouter>,
  );
}

describe('PublicHeader', () => {
  it('renders the primary navigation links', () => {
    renderHeader();
    const primaryNav = screen.getByRole('navigation', { name: 'Primary' });
    for (const label of navLabels) {
      expect(within(primaryNav).getByRole('link', { name: label })).toBeInTheDocument();
    }
  });
  it('opens the mobile menu from the keyboard and closes it with Escape', async () => {
    const user = userEvent.setup();
    renderHeader();
    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument();
    menuButton.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument();
  });
});
