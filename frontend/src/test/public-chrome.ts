import { appEnv } from '@/config/env';

export const mockPublicContactEmail = 'contact@example.test';

export const mockPublicSiteSettings = {
  id: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  companyName: 'Example Company',
  companyNameEnglish: 'Example Company',
  email: mockPublicContactEmail,
  phone: '+10000000000',
  address: '1 Example Street',
};

export const mockPublicSocialLinks = {
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

export const hardcodedCompanyEmail = 'info@shammed-group.com';

export function createPublicChromeFetchMock(
  options: { readonly failSiteSettings?: boolean } = {},
): typeof fetch {
  return async (input: RequestInfo | URL): Promise<Response> => {
    const url = String(input);
    if (url === `${appEnv.apiBaseUrl}/site-settings`) {
      if (options.failSiteSettings) {
        return new Response(
          JSON.stringify({
            message: 'Site settings were not found',
            code: 'NOT_FOUND',
            statusCode: 404,
          }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }
      return new Response(JSON.stringify({ siteSettings: mockPublicSiteSettings }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url === `${appEnv.apiBaseUrl}/social-link`) {
      return new Response(JSON.stringify(mockPublicSocialLinks), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Not found', { status: 404 });
  };
}
