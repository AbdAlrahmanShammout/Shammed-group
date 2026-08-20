import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AdminShell } from '@/components/layout/admin-shell';
import { adminNavGroups } from '@/config/admin-nav-items';

describe('AdminShell', () => {
  it('renders the SRS admin navigation groups', () => {
    render(
      <MemoryRouter>
        <AdminShell onSignOut={() => undefined} />
      </MemoryRouter>,
    );
    const adminNav = screen.getAllByRole('navigation', { name: 'Admin' })[0];
    expect(adminNav).toBeDefined();
    for (const group of adminNavGroups) {
      expect(within(adminNav!).getByText(group.label)).toBeInTheDocument();
      for (const item of group.items) {
        expect(within(adminNav!).getByRole('link', { name: item.label })).toBeInTheDocument();
      }
    }
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#admin-main-content',
    );
  });

  it('opens the mobile menu from the keyboard and closes it with Escape', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AdminShell onSignOut={() => undefined} />
      </MemoryRouter>,
    );
    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    menuButton.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('navigation', { name: 'Admin' }).length).toBeGreaterThan(0);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
