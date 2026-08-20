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
    isVisible: true,
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
    isVisible: true,
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
    isVisible: true,
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
    isVisible: true,
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
    isVisible: true,
    displayOrder: 5,
  },
  {
    name: 'OES',
    shortDescription:
      'Listed in the supplied corporate deck under “Exclusive Partners.” Current relationship and company details require client confirmation.',
    isVisible: true,
    displayOrder: 6,
  },
  {
    name: 'SMD MEDICARE',
    shortDescription:
      'Listed in the supplied corporate deck under “Exclusive Partners.” Current relationship and company details require client confirmation.',
    isVisible: true,
    displayOrder: 7,
  },
  {
    name: 'Bistos',
    shortDescription:
      'Listed in the supplied corporate deck under “Exclusive Partners.” Current relationship and company details require client confirmation.',
    isVisible: true,
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

type SeedProduct = {
  readonly name: string;
  readonly shortDescription: string;
  readonly detailedDescription: string;
  readonly manufacturer: string;
  readonly categoryName: string;
  readonly partnerName?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

/** Demo catalog items for local testing and UI review — not client-confirmed products. */
const SAMPLE_PRODUCTS: readonly SeedProduct[] = [
  {
    name: 'Demo Mobile C-Arm System',
    shortDescription: 'Sample imaging system for operating-room visualization demos.',
    detailedDescription:
      'Placeholder product used to exercise the public catalog and home products section. Replace with confirmed equipment data before production.',
    manufacturer: 'Demo Imaging Labs',
    categoryName: 'Medical Equipment',
    partnerName: 'Technix',
    isVisible: true,
    displayOrder: 1,
  },
  {
    name: 'Demo Extracorporeal Shock Wave Unit',
    shortDescription: 'Sample lithotripsy workstation for catalog layout testing.',
    detailedDescription:
      'Demo-only entry inspired by shock-wave therapy workflows. Not a real SKU and not approved for public marketing copy.',
    manufacturer: 'Demo MedTech',
    categoryName: 'Medical Equipment',
    partnerName: 'STORZ Medical AG',
    isVisible: true,
    displayOrder: 2,
  },
  {
    name: 'Demo Endoscopy Tower Kit',
    shortDescription: 'Sample endoscopy stack for hospital project mockups.',
    detailedDescription:
      'Placeholder endoscopy tower used to verify category filters, product detail pages, and partner association display.',
    manufacturer: 'Demo Scope Systems',
    categoryName: 'Medical Equipment',
    partnerName: 'KARL STORZ',
    isVisible: true,
    displayOrder: 3,
  },
  {
    name: 'Demo Electrosurgery Generator',
    shortDescription: 'Sample OR electrosurgery unit for admin and public UI checks.',
    detailedDescription:
      'Synthetic product record for regression testing of product forms, ordering, and visibility toggles.',
    manufacturer: 'Demo Surgical Power',
    categoryName: 'Medical Equipment',
    partnerName: 'KLS Martin Group',
    isVisible: true,
    displayOrder: 4,
  },
  {
    name: 'Demo Tablet Coating Machine',
    shortDescription: 'Sample pharmaceutical production equipment for seed previews.',
    detailedDescription:
      'Demo coating line entry so the Pharmaceutical Equipment category is not empty during local development.',
    manufacturer: 'Demo Pharma Process',
    categoryName: 'Pharmaceutical Equipment',
    isVisible: true,
    displayOrder: 1,
  },
  {
    name: 'Demo HPLC Quality Analyzer',
    shortDescription: 'Sample QC instrument for pharmaceutical laboratory layouts.',
    detailedDescription:
      'Placeholder HPLC analyzer used to validate product detail content blocks without real client assets.',
    manufacturer: 'Demo Lab Analytics',
    categoryName: 'Pharmaceutical Equipment',
    isVisible: true,
    displayOrder: 2,
  },
  {
    name: 'Demo Surgical Consumables Pack',
    shortDescription: 'Sample OR consumables bundle for list and filter testing.',
    detailedDescription:
      'Generic consumables pack seeded only for development demos. Replace with confirmed supply items later.',
    manufacturer: 'Demo Care Supplies',
    categoryName: 'Medical Supplies and Consumables',
    isVisible: true,
    displayOrder: 1,
  },
  {
    name: 'Demo Dialysis Consumable Set',
    shortDescription: 'Sample renal-care consumables for catalog density checks.',
    detailedDescription:
      'Demo hemodialysis accessory set linked to Dialife for partner-linking UI tests when the partner is visible.',
    manufacturer: 'Demo Renal Care',
    categoryName: 'Medical Supplies and Consumables',
    partnerName: 'Dialife Group',
    isVisible: true,
    displayOrder: 2,
  },
  {
    name: 'Demo Specialty Oncology Capsule',
    shortDescription: 'Sample specialized pharmaceutical SKU for category coverage.',
    detailedDescription:
      'Fictional specialty product used to populate Specialized Pharmaceutical Products during local testing.',
    manufacturer: 'Demo Pharma Specialty',
    categoryName: 'Specialized Pharmaceutical Products',
    isVisible: true,
    displayOrder: 1,
  },
  {
    name: 'Demo Critical-Care Injectable',
    shortDescription: 'Sample injectable listing for home and products page previews.',
    detailedDescription:
      'Hidden-by-default companion product so admins can test visibility switches against a seeded catalog.',
    manufacturer: 'Demo Hospital Pharma',
    categoryName: 'Specialized Pharmaceutical Products',
    isVisible: false,
    displayOrder: 2,
  },
];

/**
 * Seeds all confirmed CMS content: text data, locations, social links,
 * and demo products for local testing and UI review.
 * Media attachments (images) are handled separately by `pnpm restore`.
 */
export async function executeSeed(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    await seedSiteSettings(prisma);
    await seedHomePage(prisma);
    await seedAboutPage(prisma);
    await seedProductCategories(prisma);
    await seedPartners(prisma);
    await seedSampleProducts(prisma);
    await seedServices(prisma);
    await seedLocations(prisma);
    await seedSocialLinks(prisma);
  } finally {
    await prisma.$disconnect();
  }
}


async function seedSiteSettings(prisma: PrismaClient): Promise<void> {
  const data = {
    companyName: 'Shammed Group',
    companyNameEnglish: 'Shammed Group',
    companyNameArabic: 'مجموعة شاميد',
    email: 'info@shammed-group.com',
    phone: '+963 11 446992001',
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

async function seedSampleProducts(prisma: PrismaClient): Promise<void> {
  const categories = await prisma.productCategory.findMany();
  const partners = await prisma.partner.findMany();
  const categoryIdByName = new Map(categories.map((category) => [category.name, category.id]));
  const partnerIdByName = new Map(partners.map((partner) => [partner.name, partner.id]));
  const keptNames = SAMPLE_PRODUCTS.map((product) => product.name);
  await prisma.product.deleteMany({
    where: { name: { notIn: [...keptNames] } },
  });
  for (const product of SAMPLE_PRODUCTS) {
    const categoryId = categoryIdByName.get(product.categoryName);
    if (categoryId === undefined) {
      throw new Error(`Seed category missing for product "${product.name}": ${product.categoryName}`);
    }
    const partnerId =
      product.partnerName === undefined ? null : (partnerIdByName.get(product.partnerName) ?? null);
    if (product.partnerName !== undefined && partnerId === null) {
      throw new Error(`Seed partner missing for product "${product.name}": ${product.partnerName}`);
    }
    const data = {
      name: product.name,
      shortDescription: product.shortDescription,
      detailedDescription: product.detailedDescription,
      manufacturer: product.manufacturer,
      isVisible: product.isVisible,
      displayOrder: product.displayOrder,
      categoryId,
      partnerId,
    };
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data });
      continue;
    }
    await prisma.product.create({ data });
  }
}

type SeedLocation = {
  readonly name: string;
  readonly address: string;
  readonly googleMapsUrl?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly isVisible: boolean;
  readonly isMapVisible: boolean;
  readonly displayOrder: number;
  readonly phones: readonly { readonly phone: string; readonly displayOrder: number }[];
};

const LOCATIONS: readonly SeedLocation[] = [
  {
    name: 'Shammed Group Headquarters — Damascus - First branch',
    address:
      "Directorate of Health's building, Shahbandar Square, Damascus, Syria, P.O. Box 8001",
    googleMapsUrl: 'https://www.google.com/maps?q=33.52353,36.29287',
    latitude: 33.52353,
    longitude: 36.29287,
    isVisible: true,
    isMapVisible: true,
    displayOrder: 1,
    phones: [{ phone: '+963 11 44699201', displayOrder: 0 }],
  },
  {
    name: 'Shammed Group — Damascus - Second branch',
    address: 'Jul Jammal Street, Damascus, Syria, P.O. Box 8001',
    googleMapsUrl: 'https://www.google.com/maps?q=33.52178,36.29788',
    latitude: 33.52178,
    longitude: 36.29788,
    isVisible: true,
    isMapVisible: true,
    displayOrder: 2,
    phones: [{ phone: '+963 11 44699200', displayOrder: 0 }],
  },
];

async function seedLocations(prisma: PrismaClient): Promise<void> {
  const keptNames = LOCATIONS.map((l) => l.name);
  await prisma.location.deleteMany({ where: { name: { notIn: keptNames } } });
  for (const location of LOCATIONS) {
    const existing = await prisma.location.findFirst({ where: { name: location.name } });
    if (existing) {
      await prisma.locationPhone.deleteMany({ where: { locationId: existing.id } });
      await prisma.location.update({
        where: { id: existing.id },
        data: {
          address: location.address,
          googleMapsUrl: location.googleMapsUrl ?? null,
          latitude: location.latitude ?? null,
          longitude: location.longitude ?? null,
          isVisible: location.isVisible,
          isMapVisible: location.isMapVisible,
          displayOrder: location.displayOrder,
          phones: { create: location.phones.map((p) => ({ phone: p.phone, displayOrder: p.displayOrder })) },
        },
      });
      continue;
    }
    await prisma.location.create({
      data: {
        name: location.name,
        address: location.address,
        googleMapsUrl: location.googleMapsUrl ?? null,
        latitude: location.latitude ?? null,
        longitude: location.longitude ?? null,
        isVisible: location.isVisible,
        isMapVisible: location.isMapVisible,
        displayOrder: location.displayOrder,
        phones: { create: location.phones.map((p) => ({ phone: p.phone, displayOrder: p.displayOrder })) },
      },
    });
  }
}

type SeedSocialLink = {
  readonly platform: string;
  readonly url: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

const SOCIAL_LINKS: readonly SeedSocialLink[] = [
  {
    platform: 'facebook',
    url: 'https://www.facebook.com/shammed.group/',
    isVisible: true,
    displayOrder: 1,
  },
];

async function seedSocialLinks(prisma: PrismaClient): Promise<void> {
  for (const link of SOCIAL_LINKS) {
    const existing = await prisma.socialLink.findFirst({ where: { platform: link.platform } });
    if (existing) {
      await prisma.socialLink.update({
        where: { id: existing.id },
        data: { url: link.url, isVisible: link.isVisible, displayOrder: link.displayOrder },
      });
      continue;
    }
    await prisma.socialLink.create({ data: link });
  }
}

if (require.main === module) {
  void executeSeed();
}
