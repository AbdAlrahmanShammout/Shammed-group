import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { appEnv } from '@/config/env';
import { createQueryClient } from '@/config/query-client';
import { PublicContactPage } from '@/features/contact/components/public-contact-page';

const mockSiteSettings = {
  siteSettings: {
    id: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    companyName: 'Example Company',
    companyNameEnglish: 'Example Company',
    email: 'contact@example.test',
    phone: '+10000000000',
    whatsApp: '+10000000001',
    address: '1 Example Street',
  },
};

const mockLocations = {
  locations: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Example Branch',
      address: '2 Branch Road',
      googleMapsUrl: 'https://maps.google.com/?q=example',
      isVisible: true,
      isMapVisible: true,
      displayOrder: 0,
      phones: [{ id: 1, phone: '+10000000002', displayOrder: 0 }],
    },
  ],
  total: 1,
};

const mockSocialLinks = {
  socialLinks: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/example',
      isVisible: true,
      displayOrder: 1,
    },
  ],
  total: 1,
};

function createContactFetchMock(
  options: {
    readonly submitHandler?: (body: unknown) => Promise<Response>;
  } = {},
): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = String(input);
    if (url === `${appEnv.apiBaseUrl}/site-settings`) {
      return new Response(JSON.stringify(mockSiteSettings), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url === `${appEnv.apiBaseUrl}/location`) {
      return new Response(JSON.stringify(mockLocations), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url === `${appEnv.apiBaseUrl}/social-link`) {
      return new Response(JSON.stringify(mockSocialLinks), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url === `${appEnv.apiBaseUrl}/contact-inquiry` && init?.method === 'POST') {
      const body = init.body ? JSON.parse(String(init.body)) : {};
      if (options.submitHandler) {
        return options.submitHandler(body);
      }
      return new Response(JSON.stringify({ message: 'Inquiry submitted', status: 'ok' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Not found', { status: 404 });
  };
}

function renderPublicContactPage(): void {
  const queryClient = createQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PublicContactPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PublicContactPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(createContactFetchMock()));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('renders company contact details, locations, social links, and required form labels', async () => {
    renderPublicContactPage();
    expect(await screen.findByRole('heading', { name: 'Example Company' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'contact@example.test' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Example Branch' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open in Google Maps/ })).toHaveAttribute(
      'href',
      'https://maps.google.com/?q=example',
    );
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
    expect(screen.getByText('*', { selector: 'label[for="fullName"] span' })).toBeInTheDocument();
  });
  it('rejects invalid email client-side before calling the inquiry API', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(createContactFetchMock());
    vi.stubGlobal('fetch', fetchMock);
    renderPublicContactPage();
    await screen.findByRole('heading', { name: 'Contact form' });
    await user.type(screen.getByLabelText(/Full Name/), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/Email/), 'not-an-email');
    await user.type(screen.getByLabelText(/Subject/), 'Availability');
    await user.type(screen.getByLabelText(/Message/), 'Do you stock this product?');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalledWith(
      `${appEnv.apiBaseUrl}/contact-inquiry`,
      expect.anything(),
    );
  });
  it('shows success feedback after a successful inquiry submission', async () => {
    const user = userEvent.setup();
    renderPublicContactPage();
    await screen.findByRole('heading', { name: 'Contact form' });
    await user.type(screen.getByLabelText(/Full Name/), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/Email/), 'ada@example.com');
    await user.type(screen.getByLabelText(/Subject/), 'Availability');
    await user.type(screen.getByLabelText(/Message/), 'Do you stock this product?');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Your message was sent successfully.',
    );
  });
  it('maps API validation errors onto form fields', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        createContactFetchMock({
          submitHandler: async () =>
            new Response(
              JSON.stringify({
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                statusCode: 422,
                validationErrorObjects: [
                  {
                    property: 'email',
                    constraints: { isEmail: 'email must be an email' },
                  },
                ],
              }),
              { status: 422, headers: { 'Content-Type': 'application/json' } },
            ),
        }),
      ),
    );
    renderPublicContactPage();
    await screen.findByRole('heading', { name: 'Contact form' });
    await user.type(screen.getByLabelText(/Full Name/), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/Email/), 'ada@example.com');
    await user.type(screen.getByLabelText(/Subject/), 'Availability');
    await user.type(screen.getByLabelText(/Message/), 'Do you stock this product?');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => {
      expect(screen.getByText('email must be an email')).toBeInTheDocument();
    });
  });
});
