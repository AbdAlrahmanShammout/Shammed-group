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

  it('is idempotent and seeds confirmed content without products or social links', async () => {
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
      locations,
    ] = await Promise.all([
      prisma.siteSettings.findMany(),
      prisma.homePage.findMany(),
      prisma.aboutPage.findMany(),
      prisma.productCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.partner.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.product.findMany(),
      prisma.service.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.socialLink.findMany(),
      prisma.location.findMany({
        include: { phones: { orderBy: { displayOrder: 'asc' } } },
      }),
    ]);
    expect(siteSettings).toHaveLength(1);
    expect(siteSettings[0]).toEqual(
      expect.objectContaining({
        companyName: 'Shammed Group',
        companyNameEnglish: 'Shammed Group',
        companyNameArabic: 'مجموعة شاميد',
        email: 'info@shammed-group.com',
        phone: '+963 11 44699200-1',
        whatsApp: '0049-17661877753',
      }),
    );
    expect(homePages).toHaveLength(1);
    expect(homePages[0]?.heroTitle).toBe(
      'Medical Equipment and Pharmaceutical Services in Syria',
    );
    expect(homePages[0]?.aboutPreviewDescription).toContain('2005');
    expect(aboutPages).toHaveLength(1);
    expect(aboutPages[0]?.mission).toContain('medical equipment');
    expect(aboutPages[0]?.values).toContain('pending client confirmation');
    expect(categories.map((category) => category.name)).toEqual([
      'Medical Equipment',
      'Pharmaceutical Equipment',
      'Medical Supplies and Consumables',
      'Specialized Pharmaceutical Products',
    ]);
    expect(partners).toHaveLength(8);
    expect(partners.every((partner) => partner.isVisible === false)).toBe(true);
    expect(products).toHaveLength(0);
    expect(services).toHaveLength(5);
    expect(socialLinks).toHaveLength(0);
    expect(locations).toHaveLength(1);
    expect(locations[0]).toEqual(
      expect.objectContaining({
        name: 'Shammed Group Headquarters — Damascus',
        isVisible: true,
      }),
    );
    expect(locations[0]?.phones.map((phone) => phone.phone)).toEqual([
      '+963 11 44699200',
      '+963 11 44699201',
    ]);
  });
});
