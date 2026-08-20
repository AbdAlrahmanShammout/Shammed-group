import { render, screen, within } from '@testing-library/react';
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
  });
});
