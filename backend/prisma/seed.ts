import { Prisma, PrismaClient } from '@prisma/client';

const CONFIRMED_COMPANY_NAME = 'Shammed Group';
const CONFIRMED_COMPANY_NAME_ARABIC = 'مجموعة شاميد';
const CONFIRMED_EMAIL = 'info@shammed-group.com';
const CONFIRMED_FOUNDED_YEAR = '2005';
const HOME_PAGE_SINGLETON_KEY = 'default';
const ABOUT_PAGE_SINGLETON_KEY = 'default';
const PLACEHOLDER_NOTE = 'Placeholder example. Not confirmed by Shammed Group.';
const PLACEHOLDER_PHONE = 'Placeholder — not confirmed';
const PLACEHOLDER_PARTNER_NAME = 'Placeholder Partner';
const PLACEHOLDER_PRODUCT_NAME = 'Placeholder Product';
const PLACEHOLDER_CATEGORY_NAMES = [
  'Pharmaceutical Products',
  'Medical Devices & Supplies',
  'Nutritional Supplements',
  'Healthcare Products',
] as const;
const PLACEHOLDER_SERVICE_TITLES = [
  'Pharmaceutical Product Distribution',
  'Medical Product Distribution',
  'International Company Representation',
] as const;
const PLACEHOLDER_SOCIAL_PLATFORMS = ['Placeholder LinkedIn', 'Placeholder Facebook'] as const;

export async function executeSeed(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    await seedSiteSettings(prisma);
    await seedHomePage(prisma);
    await seedAboutPage(prisma);
    await seedSocialLinks(prisma);
    await seedProductCategories(prisma);
    await seedPartners(prisma);
    await seedServices(prisma);
    await seedProducts(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedSiteSettings(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.siteSettings.findFirst();
  const confirmedFields = {
    companyName: CONFIRMED_COMPANY_NAME,
    companyNameEnglish: CONFIRMED_COMPANY_NAME,
    companyNameArabic: CONFIRMED_COMPANY_NAME_ARABIC,
    email: CONFIRMED_EMAIL,
  };
  if (existing) {
    await prisma.siteSettings.update({
      where: { id: existing.id },
      data: confirmedFields,
    });
    return;
  }
  await prisma.siteSettings.create({
    data: {
      ...confirmedFields,
      phone: PLACEHOLDER_PHONE,
    },
  });
}

async function seedHomePage(prisma: PrismaClient): Promise<void> {
  const data: Prisma.HomePageCreateWithoutHeroImageInput = {
    singletonKey: HOME_PAGE_SINGLETON_KEY,
    heroTitle: CONFIRMED_COMPANY_NAME,
    heroDescription: `Pharmaceutical and healthcare distribution since ${CONFIRMED_FOUNDED_YEAR}.`,
    primaryCtaText: 'Learn more',
    primaryCtaUrl: '/about',
    secondaryCtaText: 'Contact us',
    secondaryCtaUrl: '/contact',
    aboutPreviewTitle: 'About us',
    aboutPreviewDescription: `${CONFIRMED_COMPANY_NAME} was founded in ${CONFIRMED_FOUNDED_YEAR}.`,
    aboutPreviewCtaText: 'Read more',
    aboutPreviewCtaUrl: '/about',
    partnersSectionTitle: 'Our partners',
    partnersSectionDescription: PLACEHOLDER_NOTE,
    productsSectionTitle: 'Our products',
    productsSectionDescription: PLACEHOLDER_NOTE,
    servicesSectionTitle: 'Our services',
    servicesSectionDescription: PLACEHOLDER_NOTE,
    whyTitle: `Why ${CONFIRMED_COMPANY_NAME}`,
    whyDescription: PLACEHOLDER_NOTE,
    contactSectionTitle: 'Contact us',
    contactSectionDescription: PLACEHOLDER_NOTE,
  };
  await prisma.homePage.upsert({
    where: { singletonKey: HOME_PAGE_SINGLETON_KEY },
    create: data,
    update: data,
  });
}

async function seedAboutPage(prisma: PrismaClient): Promise<void> {
  const data: Prisma.AboutPageCreateWithoutOverviewImageInput = {
    singletonKey: ABOUT_PAGE_SINGLETON_KEY,
    overview: `${CONFIRMED_COMPANY_NAME} was established in ${CONFIRMED_FOUNDED_YEAR}.`,
    vision: PLACEHOLDER_NOTE,
    mission: PLACEHOLDER_NOTE,
    values: PLACEHOLDER_NOTE,
    capabilities: PLACEHOLDER_NOTE,
  };
  await prisma.aboutPage.upsert({
    where: { singletonKey: ABOUT_PAGE_SINGLETON_KEY },
    create: data,
    update: data,
  });
}

async function seedSocialLinks(prisma: PrismaClient): Promise<void> {
  for (const [displayOrder, platform] of PLACEHOLDER_SOCIAL_PLATFORMS.entries()) {
    const existing = await prisma.socialLink.findFirst({ where: { platform } });
    const data = {
      platform,
      url: `https://example.com/${platform.toLowerCase().replaceAll(' ', '-')}`,
      isVisible: true,
      displayOrder,
    };
    if (existing) {
      await prisma.socialLink.update({ where: { id: existing.id }, data });
      continue;
    }
    await prisma.socialLink.create({ data });
  }
}

async function seedProductCategories(prisma: PrismaClient): Promise<void> {
  for (const [displayOrder, name] of PLACEHOLDER_CATEGORY_NAMES.entries()) {
    const existing = await prisma.productCategory.findFirst({ where: { name } });
    const data = {
      name,
      description: PLACEHOLDER_NOTE,
      isVisible: true,
      displayOrder,
    };
    if (existing) {
      await prisma.productCategory.update({ where: { id: existing.id }, data });
      continue;
    }
    await prisma.productCategory.create({ data });
  }
}

async function seedPartners(prisma: PrismaClient): Promise<void> {
  const existing = await prisma.partner.findFirst({ where: { name: PLACEHOLDER_PARTNER_NAME } });
  const data = {
    name: PLACEHOLDER_PARTNER_NAME,
    shortDescription: PLACEHOLDER_NOTE,
    fullDescription: PLACEHOLDER_NOTE,
    specialization: PLACEHOLDER_NOTE,
    isVisible: true,
    displayOrder: 0,
  };
  if (existing) {
    await prisma.partner.update({ where: { id: existing.id }, data });
    return;
  }
  await prisma.partner.create({ data });
}

async function seedServices(prisma: PrismaClient): Promise<void> {
  for (const [displayOrder, title] of PLACEHOLDER_SERVICE_TITLES.entries()) {
    const existing = await prisma.service.findFirst({ where: { title } });
    const data = {
      title,
      description: PLACEHOLDER_NOTE,
      isVisible: true,
      displayOrder,
    };
    if (existing) {
      await prisma.service.update({ where: { id: existing.id }, data });
      continue;
    }
    await prisma.service.create({ data });
  }
}

async function seedProducts(prisma: PrismaClient): Promise<void> {
  const category = await prisma.productCategory.findFirst({
    where: { name: PLACEHOLDER_CATEGORY_NAMES[0] },
  });
  const partner = await prisma.partner.findFirst({ where: { name: PLACEHOLDER_PARTNER_NAME } });
  if (!category || !partner) {
    throw new Error('Placeholder category and partner must be seeded before products');
  }
  const existing = await prisma.product.findFirst({ where: { name: PLACEHOLDER_PRODUCT_NAME } });
  const data = {
    name: PLACEHOLDER_PRODUCT_NAME,
    shortDescription: PLACEHOLDER_NOTE,
    detailedDescription: PLACEHOLDER_NOTE,
    manufacturer: PLACEHOLDER_NOTE,
    isVisible: true,
    displayOrder: 0,
    categoryId: category.id,
    partnerId: partner.id,
  };
  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data });
    return;
  }
  await prisma.product.create({ data });
}

if (require.main === module) {
  void executeSeed();
}
