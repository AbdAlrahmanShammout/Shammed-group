import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

import { ConfigsModule } from '@/config/configs.module';
import { executeSeed } from '../prisma/seed';

describe('Seed (e2e)', () => {
  let configsModule: TestingModule;
  let prisma: PrismaClient;

  beforeAll(async () => {
    configsModule = await Test.createTestingModule({
      imports: [ConfigsModule],
    }).compile();
    await configsModule.init();
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await configsModule.close();
  });

  it('is idempotent and seeds confirmed company fields with placeholder catalog rows', async () => {
    await executeSeed();
    await executeSeed();
    const [
      siteSettings,
      homePages,
      aboutPages,
      categories,
      partners,
      products,
      services,
      socialLinks,
    ] = await Promise.all([
      prisma.siteSettings.findMany(),
      prisma.homePage.findMany(),
      prisma.aboutPage.findMany(),
      prisma.productCategory.findMany({
        where: {
          name: {
            in: [
              'Pharmaceutical Products',
              'Medical Devices & Supplies',
              'Nutritional Supplements',
              'Healthcare Products',
            ],
          },
        },
      }),
      prisma.partner.findMany({ where: { name: 'Placeholder Partner' } }),
      prisma.product.findMany({ where: { name: 'Placeholder Product' } }),
      prisma.service.findMany({
        where: {
          title: {
            in: [
              'Pharmaceutical Product Distribution',
              'Medical Product Distribution',
              'International Company Representation',
            ],
          },
        },
      }),
      prisma.socialLink.findMany({
        where: { platform: { in: ['Placeholder LinkedIn', 'Placeholder Facebook'] } },
      }),
    ]);
    expect(siteSettings).toHaveLength(1);
    expect(siteSettings[0]).toEqual(
      expect.objectContaining({
        companyName: 'Shammed Group',
        companyNameEnglish: 'Shammed Group',
        companyNameArabic: 'مجموعة شاميد',
        email: 'info@shammed-group.com',
      }),
    );
    expect(homePages).toHaveLength(1);
    expect(homePages[0]?.heroTitle).toBe('Shammed Group');
    expect(homePages[0]?.aboutPreviewDescription).toContain('2005');
    expect(aboutPages).toHaveLength(1);
    expect(aboutPages[0]?.overview).toContain('2005');
    expect(categories).toHaveLength(4);
    expect(categories.every((category) => category.description?.includes('Placeholder'))).toBe(
      true,
    );
    expect(partners).toHaveLength(1);
    expect(products).toHaveLength(1);
    expect(services).toHaveLength(3);
    expect(services.every((service) => service.description.includes('Placeholder'))).toBe(true);
    expect(socialLinks).toHaveLength(2);
  });
});
