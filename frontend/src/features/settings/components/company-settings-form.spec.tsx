import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sessionTokenStore } from '@/api/session-token-store';
import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { CompanySettingsForm } from '@/features/settings/components/company-settings-form';

function renderForm(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <CompanySettingsForm />
    </QueryClientProvider>,
  );
}

describe('CompanySettingsForm', () => {
  beforeEach(() => {
    sessionTokenStore.set('input-token');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    sessionTokenStore.clear();
    vi.unstubAllGlobals();
  });

  it('shows validation messages for required company fields', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole('button', { name: 'Create settings' }));
    expect(screen.getByText('Company name is required')).toBeInTheDocument();
    expect(screen.getByText('English company name is required')).toBeInTheDocument();
    expect(screen.getByText('Phone is required')).toBeInTheDocument();
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it('creates settings when the form is valid', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (): Promise<Response> => {
        return new Response(
          JSON.stringify({
            siteSettings: {
              id: 1,
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-01-01T00:00:00.000Z',
              companyName: 'Shammed Group',
              companyNameEnglish: 'Shammed Group',
              email: 'info@shammed-group.com',
              phone: '+963',
            },
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );
    renderForm();
    await user.type(screen.getByLabelText(/^Company name/), 'Shammed Group');
    await user.type(screen.getByLabelText(/^English company name/), 'Shammed Group');
    await user.type(screen.getByLabelText(/^Main phone/), '+963');
    await user.click(screen.getByRole('button', { name: 'Create settings' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Settings saved successfully.');
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/admin/site-settings`,
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
