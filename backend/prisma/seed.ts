import { Prisma, PrismaClient } from '@prisma/client';

const HOME_PAGE_SINGLETON_KEY = 'default';
const ABOUT_PAGE_SINGLETON_KEY = 'default';
const PENDING_VALUES =
  'Formal company values pending client confirmation.';

type SeedPartner = {
  readonly name: string;
  readonly shortDescription: string;
  readonly fullDescription?: string;
  readonly specialization?: string;
  readonly websiteUrl?: string;
  readonly country?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

type SeedCategory = {
  readonly name: string;
  readonly description: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

type SeedService = {
  readonly title: string;
  readonly description: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

const PRODUCT_CATEGORIES: readonly SeedCategory[] = [
  {
    name: 'Medical Equipment',
    description: 'Medical equipment distributed, installed, and serviced for healthcare organizations.',
    isVisible: true,
    displayOrder: 1,
  },
  {
    name: 'Pharmaceutical Equipment',
    description: 'Technical equipment for pharmaceutical production and quality control.',
    isVisible: true,
    displayOrder: 2,
  },
  {
    name: 'Medical Supplies and Consumables',
    description: 'Operation supplies and medical consumables distributed by Shammed Group.',
    isVisible: true,
    displayOrder: 3,
  },
  {
    name: 'Specialized Pharmaceutical Products',
    description: 'Specialized pharmaceutical products supplied to the healthcare market in Syria.',
    isVisible: true,
    displayOrder: 4,
  },
];

const PARTNERS: readonly SeedPartner[] = [
  {
    name: 'STORZ Medical AG',
    shortDescription:
      'Named in the supplied company profile as a Shammed Group partner since 2007; the profile states that more than 30 ESWL units are in Syria.',
    fullDescription:
      'The supplied profile describes STORZ MEDICAL as a medical technology company associated with shock-wave therapy and lithotripsy. Current relationship, territory, and exclusivity require client confirmation.',
    specialization: 'Shock-wave therapy and lithotripsy',
    websiteUrl: 'https://www.storzmedical.com/en/',
    country: 'Switzerland',
    isVisible: false,
    displayOrder: 1,
  },
  {
    name: 'Technix',
    shortDescription:
      'Named in the supplied company profile as a partner and described as a producer of radiography and fluoroscopy devices.',
    fullDescription:
      'The supplied profile describes Technix as a European producer of devices for radiography and fluoroscopy. Current relationship and territory require client confirmation.',
    specialization: 'Radiography and fluoroscopy',
    websiteUrl: 'https://www.technix.it/',
    isVisible: false,
    displayOrder: 2,
  },
  {
    name: 'KARL STORZ',
    shortDescription:
      'Named in the supplied company profile and corporate deck as a medical-technology partner.',
    fullDescription:
      'The supplied profile describes KARL STORZ as a medical-technology company. The corporate deck places it under a heading for exclusive agencies; the individual appointment and current status require client confirmation.',
    specialization: 'Medical technology and endoscopy',
    websiteUrl: 'https://www.karlstorz.com/us/en/',
    country: 'Germany',
    isVisible: false,
    displayOrder: 3,
  },
  {
    name: 'KLS Martin Group',
    shortDescription:
      'Named in the supplied company profile and corporate deck as a medical-technology partner.',
    fullDescription:
      'The supplied profile describes KLS Martin Group as a group of medical-technology companies. Current relationship, territory, and exclusivity require client confirmation.',
    specialization: 'Medical technology',
    websiteUrl: 'https://www.klsmartin.com/en-na/',
    country: 'Germany',
    isVisible: false,
    displayOrder: 4,
  },
  {
    name: 'Dialife Group',
    shortDescription:
      'Named in the supplied company profile and corporate deck as a partner; the profile describes Dialife as a provider of renal-care products, equipment, and services.',
    fullDescription:
      'The supplied profile describes Dialife as a global provider of products, equipment, and services for renal care and hemodialysis treatment. Current relationship and exclusivity require client confirmation.',
    specialization: 'Renal care and hemodialysis',
    websiteUrl: 'https://www.dialifegroup.com/',
    country: 'Switzerland',
    isVisible: false,
    displayOrder: 5,
  },
  {
    name: 'OES',
    shortDescription:
      'Listed in the supplied corporate deck under “Exclusive Partners.” Current relationship and company details require client confirmation.',
    isVisible: false,
    displayOrder: 6,
  },
  {
    name: 'SMD MEDICARE',
    shortDescription:
      'Listed in the supplied corporate deck under “Exclusive Partners.” Current relationship and company details require client confirmation.',
    isVisible: false,
    displayOrder: 7,
  },
  {
    name: 'Bistos',
    shortDescription:
      'Listed in the supplied corporate deck under “Exclusive Partners.” Current relationship and company details require client confirmation.',
    isVisible: false,
    displayOrder: 8,
  },
];

const SERVICES: readonly SeedService[] = [
  {
    title: 'Medical Equipment Distribution',
    description:
      'Distribution of high-quality medical equipment for private clinics, hospitals, and healthcare organizations across Syria.',
    isVisible: true,
    displayOrder: 1,
  },
  {
    title: 'Installation, Maintenance, and After-Sales Support',
    description:
      'Technical service, installation, maintenance, preventive maintenance, and after-sales customer service delivered by trained service and engineering staff.',
    isVisible: true,
    displayOrder: 2,
  },
  {
    title: 'Pharmaceutical Equipment and Distribution',
    description:
      'Technical equipment for pharmaceutical production and quality control, together with specialized pharmaceutical products supplied to the healthcare market in Syria.',
    isVisible: true,
    displayOrder: 3,
  },
  {
    title: 'Turnkey Healthcare Projects',
    description:
      'Comprehensive project planning for hospital and healthcare projects, supported by international experts and suppliers of medical and pharmaceutical equipment.',
    isVisible: true,
    displayOrder: 4,
  },
  {
    title: 'Operation Supplies and Medical Consumables',
    description: 'Distribution of operation supplies and medical consumables for healthcare customers.',
    isVisible: true,
    displayOrder: 5,
  },
];

/**
 * Seeds confirmed CMS content from the content collection sheet.
 * Products and social links are intentionally not seeded.
 */
export async function executeSeed(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    await clearProductsAndSocialLinks(prisma);
    await seedSiteSettings(prisma);
    await seedHomePage(prisma);
    await seedAboutPage(prisma);
    await seedProductCategories(prisma);
    await seedPartners(prisma);
    await seedServices(prisma);
    await seedHeadquartersLocation(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

async function clearProductsAndSocialLinks(prisma: PrismaClient): Promise<void> {
  await prisma.product.deleteMany();
  await prisma.socialLink.deleteMany();
}

async function seedSiteSettings(prisma: PrismaClient): Promise<void> {
  const data = {
    companyName: 'Shammed Group',
    companyNameEnglish: 'Shammed Group',
    companyNameArabic: 'مجموعة شاميد',
    email: 'info@shammed-group.com',
    phone: '+963 11 44699200-1',
    whatsApp: '0049-17661877753',
    address:
      "Directorate of Health's building, Shahbandar Square, Damascus, Syria, P.O. Box 8001",
  };
  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    await prisma.siteSettings.update({
      where: { id: existing.id },
      data,
    });
    return;
  }
  await prisma.siteSettings.create({ data });
}

async function seedHomePage(prisma: PrismaClient): Promise<void> {
  const data: Prisma.HomePageCreateWithoutHeroImageInput = {
    singletonKey: HOME_PAGE_SINGLETON_KEY,
    heroTitle: 'Medical Equipment and Pharmaceutical Services in Syria',
    heroDescription:
      'Shammed Group provides medical equipment, technical services, operation supplies, medical consumables, and specialized pharmaceutical products to the healthcare market in Syria.',
    primaryCtaText: 'Explore Our Services',
    primaryCtaUrl: '/services',
    secondaryCtaText: 'Contact Shammed Group',
    secondaryCtaUrl: '/contact',
    aboutPreviewTitle: 'About Shammed Group',
    aboutPreviewDescription:
      'Established in Damascus in 2005, Shammed Group distributes and services medical equipment, supports turnkey hospital projects, and supplies technical equipment for pharmaceutical production and quality control.',
    aboutPreviewCtaText: 'Learn About Us',
    aboutPreviewCtaUrl: '/about',
    partnersSectionTitle: 'Our Partners',
    partnersSectionDescription:
      'Shammed Group works with international medical-equipment and pharmaceutical organizations. Current relationship and logo-use approvals must be confirmed for each partner before publication.',
    productsSectionTitle: 'Medical and Pharmaceutical Solutions',
    productsSectionDescription:
      "Explore Shammed Group's medical equipment, pharmaceutical equipment, operation supplies, medical consumables, and specialized pharmaceutical products.",
    servicesSectionTitle: 'Our Services',
    servicesSectionDescription:
      'From project planning and equipment distribution to installation, maintenance, and after-sales support, Shammed Group serves healthcare organizations across Syria.',
    whyTitle: 'Why Shammed Group',
    whyDescription:
      'Shammed Group combines a distribution network throughout Syria with trained service engineers, international supplier connections, turnkey-project experience, and technical support for medical equipment and pharmaceutical operations.',
    contactSectionTitle: 'Talk to Our Team',
    contactSectionDescription:
      'Contact Shammed Group about medical equipment, pharmaceutical solutions, technical service, or distribution support in Syria.',
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
    overview:
      'Shammed Group was established in Damascus, Syria, in 2005 as an independent branch company of the German Moramed-Con-b-Con GmbH. The company distributes and services high-quality medical equipment, operation supplies, and medical consumables, and has delivered turnkey projects for hospitals across Syria. Since 2013, its activities have also included technical equipment for pharmaceutical production and quality control.',
    vision: 'To be a leading provider by demonstrating medical excellence and superior customer service.',
    mission:
      'Providing high-quality medical equipment and specialized pharmaceutical products to the healthcare market in Syria.',
    values: PENDING_VALUES,
    capabilities:
      'Medical-equipment distribution and servicing; turnkey hospital project planning; installation of used MRI, CT, and X-ray equipment; maintenance and preventive maintenance; distribution of operation supplies and medical consumables; pharmaceutical sourcing and distribution; and technical equipment for pharmaceutical production and quality control.',
  };
  await prisma.aboutPage.upsert({
    where: { singletonKey: ABOUT_PAGE_SINGLETON_KEY },
    create: data,
    update: data,
  });
}

async function seedProductCategories(prisma: PrismaClient): Promise<void> {
  const keptNames = PRODUCT_CATEGORIES.map((category) => category.name);
  await prisma.productCategory.deleteMany({
    where: { name: { notIn: [...keptNames] } },
  });
  for (const category of PRODUCT_CATEGORIES) {
    const existing = await prisma.productCategory.findFirst({ where: { name: category.name } });
    if (existing) {
      await prisma.productCategory.update({
        where: { id: existing.id },
        data: {
          description: category.description,
          isVisible: category.isVisible,
          displayOrder: category.displayOrder,
        },
      });
      continue;
    }
    await prisma.productCategory.create({ data: category });
  }
}

async function seedPartners(prisma: PrismaClient): Promise<void> {
  const keptNames = PARTNERS.map((partner) => partner.name);
  await prisma.partner.deleteMany({
    where: { name: { notIn: [...keptNames] } },
  });
  for (const partner of PARTNERS) {
    const data = {
      name: partner.name,
      shortDescription: partner.shortDescription,
      fullDescription: partner.fullDescription ?? null,
      specialization: partner.specialization ?? null,
      websiteUrl: partner.websiteUrl ?? null,
      country: partner.country ?? null,
      isVisible: partner.isVisible,
      displayOrder: partner.displayOrder,
    };
    const existing = await prisma.partner.findFirst({ where: { name: partner.name } });
    if (existing) {
      await prisma.partner.update({ where: { id: existing.id }, data });
      continue;
    }
    await prisma.partner.create({ data });
  }
}

async function seedServices(prisma: PrismaClient): Promise<void> {
  const keptTitles = SERVICES.map((service) => service.title);
  await prisma.service.deleteMany({
    where: { title: { notIn: [...keptTitles] } },
  });
  for (const service of SERVICES) {
    const existing = await prisma.service.findFirst({ where: { title: service.title } });
    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: {
          description: service.description,
          isVisible: service.isVisible,
          displayOrder: service.displayOrder,
        },
      });
      continue;
    }
    await prisma.service.create({ data: service });
  }
}

async function seedHeadquartersLocation(prisma: PrismaClient): Promise<void> {
  const name = 'Shammed Group Headquarters — Damascus';
  const address =
    "Directorate of Health's building, Shahbandar Square, Damascus, Syria, P.O. Box 8001";
  const phones = [
    { phone: '+963 11 44699200', displayOrder: 0 },
    { phone: '+963 11 44699201', displayOrder: 1 },
  ];
  const existing = await prisma.location.findFirst({ where: { name } });
  if (existing) {
    await prisma.locationPhone.deleteMany({ where: { locationId: existing.id } });
    await prisma.location.update({
      where: { id: existing.id },
      data: {
        address,
        isVisible: true,
        displayOrder: 1,
        googleMapsUrl: null,
        latitude: null,
        longitude: null,
        phones: { create: phones },
      },
    });
    return;
  }
  await prisma.location.create({
    data: {
      name,
      address,
      isVisible: true,
      displayOrder: 1,
      phones: { create: phones },
    },
  });
}

if (require.main === module) {
  void executeSeed();
}
