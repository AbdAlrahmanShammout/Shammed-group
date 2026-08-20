import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AppRoutes } from '@/app/app-routes';
import { AuthSessionProvider } from '@/app/auth-session-provider';
import { appPaths } from '@/config/app-paths';
import { createQueryClient } from '@/config/query-client';

describe('LoginForm', () => {
  it('blocks submit when the password is empty', async () => {
    const user = userEvent.setup();
    const queryClient = createQueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[appPaths.adminLogin]}>
          <AuthSessionProvider>
            <AppRoutes />
          </AuthSessionProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Password is required');
  });
});
