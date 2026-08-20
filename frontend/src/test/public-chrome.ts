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

export const mockPublicHomePage = {
  homePage: {
    id: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    heroTitle: 'Example Company',
    heroDescription: 'Healthcare distribution since 2005.',
    primaryCtaText: 'Learn More',
    primaryCtaUrl: '/about',
    secondaryCtaText: 'Contact Us',
    secondaryCtaUrl: '/contact',
    aboutPreviewTitle: 'About Us',
    aboutPreviewDescription: 'Founded in 2005.',
    aboutPreviewCtaText: 'Read more',
    aboutPreviewCtaUrl: '/about',
    partnersSectionTitle: 'Our Partners',
    partnersSectionDescription: 'Selected partners.',
    productsSectionTitle: 'Our Products',
    productsSectionDescription: 'Selected products.',
    servicesSectionTitle: 'Our Services',
    servicesSectionDescription: 'Selected services.',
    whyTitle: 'Why Example Company',
    whyDescription: 'Experience and partnerships.',
    contactSectionTitle: 'Contact Us',
    contactSectionDescription: 'Reach our offices.',
  },
  partners: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Visible Partner',
      shortDescription: 'Shown on home',
      specialization: 'Oncology',
      websiteUrl: 'https://www.visible-partner.example',
      isVisible: true,
      displayOrder: 0,
    },
  ],
  products: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      name: 'Visible Product',
      shortDescription: 'Shown on home',
      manufacturer: 'Visible Labs',
      isVisible: true,
      displayOrder: 0,
      categoryId: 1,
      partnerId: 1,
      category: {
        id: 1,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        name: 'Pharmaceutical Products',
        isVisible: true,
        displayOrder: 0,
      },
      partner: {
        id: 1,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        name: 'Visible Partner',
        shortDescription: 'Shown on home',
        isVisible: true,
        displayOrder: 0,
      },
    },
  ],
  services: [
    {
      id: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      title: 'Visible Service',
      description: 'Shown on home',
      isVisible: true,
      displayOrder: 0,
    },
  ],
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
    if (url === `${appEnv.apiBaseUrl}/home-page`) {
      return new Response(JSON.stringify(mockPublicHomePage), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Not found', { status: 404 });
  };
}
