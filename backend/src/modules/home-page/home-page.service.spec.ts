import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { HomePageEntity } from '@/modules/home-page/entity/home-page.entity';
import { HomePageAlreadyExistsException } from '@/modules/home-page/exceptions/home-page-already-exists.exception';
import { HomePageService } from '@/modules/home-page/home-page.service';
import { HomePageRepository } from '@/modules/home-page/repository/home-page.repository';
import { MediaService } from '@/modules/media/media.service';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';
import { PartnerService } from '@/modules/partner/partner.service';
import { ProductEntity } from '@/modules/product/entity/product.entity';
import { ProductService } from '@/modules/product/product.service';
import { ServiceEntity } from '@/modules/service/entity/service.entity';
import { ServiceService } from '@/modules/service/service.service';

describe('HomePageService', () => {
  const expectedHomePage = new HomePageEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    heroTitle: 'Shammed Group',
    heroDescription: 'Pharmaceutical and medical product distribution since 2005.',
    heroImageMediaId: null,
    primaryCtaText: 'Learn More',
    primaryCtaUrl: '/about',
    secondaryCtaText: 'Contact Us',
    secondaryCtaUrl: '/contact',
    aboutPreviewTitle: 'About Us',
    aboutPreviewDescription: 'Founded in 2005.',
    aboutPreviewImageMediaId: null,
    aboutPreviewCtaText: 'Read more',
    aboutPreviewCtaUrl: '/about',
    partnersSectionTitle: 'Our Partners',
    partnersSectionDescription: null,
    productsSectionTitle: 'Our Products',
    productsSectionDescription: null,
    servicesSectionTitle: 'Our Services',
    servicesSectionDescription: null,
    whyTitle: 'Why Shammed Group',
    whyDescription: 'Experience and international partnerships.',
    whyEyebrow: 'Our identity',
    whyReason1Title: 'Quality-Certified Portfolio',
    whyReason1Description: 'Every product meets rigorous standards.',
    whyReason2Title: 'Trusted Global Partnerships',
    whyReason2Description: 'Direct distribution agreements with manufacturers.',
    whyReason3Title: 'Decades of Regional Expertise',
    whyReason3Description: 'Established networks across the MENA region.',
    whyReason4Title: 'Reliable Supply Chain',
    whyReason4Description: 'Consistent product availability.',
    whyImageMediaId: null,
    heroEyebrow: 'FORMULATION / 01 — SYRIA',
    aboutEyebrow: 'About us',
    aboutMetric1Value: '40+',
    aboutMetric1Label: 'Years in healthcare',
    aboutMetric2Value: '300+',
    aboutMetric2Label: 'Products & equipment',
    aboutMetric3Value: '100%',
    aboutMetric3Label: 'Syria coverage',
    contactSectionTitle: 'Contact Us',
    contactSectionDescription: null,
  });
  const createInput = {
    heroTitle: expectedHomePage.heroTitle,
    heroDescription: expectedHomePage.heroDescription,
    primaryCtaText: expectedHomePage.primaryCtaText,
    primaryCtaUrl: expectedHomePage.primaryCtaUrl,
    secondaryCtaText: expectedHomePage.secondaryCtaText,
    secondaryCtaUrl: expectedHomePage.secondaryCtaUrl,
    aboutPreviewTitle: expectedHomePage.aboutPreviewTitle,
    aboutPreviewDescription: expectedHomePage.aboutPreviewDescription,
    aboutPreviewCtaText: expectedHomePage.aboutPreviewCtaText,
    aboutPreviewCtaUrl: expectedHomePage.aboutPreviewCtaUrl,
    partnersSectionTitle: expectedHomePage.partnersSectionTitle,
    productsSectionTitle: expectedHomePage.productsSectionTitle,
    servicesSectionTitle: expectedHomePage.servicesSectionTitle,
    whyTitle: expectedHomePage.whyTitle,
    whyDescription: expectedHomePage.whyDescription,
    whyEyebrow: expectedHomePage.whyEyebrow,
    whyReason1Title: expectedHomePage.whyReason1Title,
    whyReason1Description: expectedHomePage.whyReason1Description,
    whyReason2Title: expectedHomePage.whyReason2Title,
    whyReason2Description: expectedHomePage.whyReason2Description,
    whyReason3Title: expectedHomePage.whyReason3Title,
    whyReason3Description: expectedHomePage.whyReason3Description,
    whyReason4Title: expectedHomePage.whyReason4Title,
    whyReason4Description: expectedHomePage.whyReason4Description,
    heroEyebrow: expectedHomePage.heroEyebrow,
    aboutEyebrow: expectedHomePage.aboutEyebrow,
    aboutMetric1Value: expectedHomePage.aboutMetric1Value,
    aboutMetric1Label: expectedHomePage.aboutMetric1Label,
    aboutMetric2Value: expectedHomePage.aboutMetric2Value,
    aboutMetric2Label: expectedHomePage.aboutMetric2Label,
    aboutMetric3Value: expectedHomePage.aboutMetric3Value,
    aboutMetric3Label: expectedHomePage.aboutMetric3Label,
    contactSectionTitle: expectedHomePage.contactSectionTitle,
  };
  const expectedPartner = new PartnerEntity({
    id: 1,
    createdAt: expectedHomePage.createdAt,
    updatedAt: expectedHomePage.updatedAt,
    name: 'Visible Partner',
    shortDescription: 'Shown publicly',
    fullDescription: null,
    specialization: null,
    websiteUrl: null,
    country: null,
    isVisible: true,
    displayOrder: 0,
    logoMediaId: null,
  });
  const expectedProduct = new ProductEntity({
    id: 1,
    createdAt: expectedHomePage.createdAt,
    updatedAt: expectedHomePage.updatedAt,
    name: 'Visible product',
    shortDescription: 'Shown publicly',
    detailedDescription: null,
    manufacturer: null,
    isVisible: true,
    displayOrder: 0,
    categoryId: 1,
    partnerId: null,
    imageMediaId: null,
  });
  const expectedService = new ServiceEntity({
    id: 1,
    createdAt: expectedHomePage.createdAt,
    updatedAt: expectedHomePage.updatedAt,
    title: 'Visible Service',
    description: 'Shown publicly',
    isVisible: true,
    displayOrder: 0,
    imageMediaId: null,
  });
  let homePageService: HomePageService;
  let homePageRepository: {
    create: jest.Mock;
    findSingleton: jest.Mock;
    update: jest.Mock;
  };
  let mediaService: {
    getMediaById: jest.Mock;
  };
  let partnerService: {
    findPublicPartners: jest.Mock;
  };
  let productService: {
    findPublicProducts: jest.Mock;
  };
  let serviceService: {
    findPublicServices: jest.Mock;
  };

  beforeEach(async () => {
    homePageRepository = {
      create: jest.fn().mockResolvedValue(expectedHomePage),
      findSingleton: jest.fn().mockResolvedValue(expectedHomePage),
      update: jest.fn().mockResolvedValue(expectedHomePage),
    };
    mediaService = {
      getMediaById: jest.fn().mockResolvedValue({ id: 8 }),
    };
    partnerService = {
      findPublicPartners: jest.fn().mockResolvedValue({ entities: [expectedPartner], total: 1 }),
    };
    productService = {
      findPublicProducts: jest.fn().mockResolvedValue({ entities: [expectedProduct], total: 1 }),
    };
    serviceService = {
      findPublicServices: jest.fn().mockResolvedValue({ entities: [expectedService], total: 1 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomePageService,
        { provide: HomePageRepository, useValue: homePageRepository },
        { provide: MediaService, useValue: mediaService },
        { provide: PartnerService, useValue: partnerService },
        { provide: ProductService, useValue: productService },
        { provide: ServiceService, useValue: serviceService },
      ],
    }).compile();
    homePageService = module.get(HomePageService);
  });

  it('creates the singleton home page record', async () => {
    homePageRepository.findSingleton.mockResolvedValue(null);
    const actual = await homePageService.createHomePage(createInput);
    expect(actual).toBe(expectedHomePage);
    expect(homePageRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        heroTitle: 'Shammed Group',
        partnersSectionDescription: null,
        heroImageMediaId: null,
      }),
    );
  });

  it('rejects a second home page record', async () => {
    await expect(homePageService.createHomePage(createInput)).rejects.toBeInstanceOf(
      HomePageAlreadyExistsException,
    );
    expect(homePageRepository.create).not.toHaveBeenCalled();
  });

  it('throws ResourceNotFoundException when the home page is missing', async () => {
    homePageRepository.findSingleton.mockResolvedValue(null);
    await expect(homePageService.getHomePage()).rejects.toBeInstanceOf(ResourceNotFoundException);
  });

  it('composes public CMS fields with visible catalog previews', async () => {
    const actual = await homePageService.getPublicHomePage();
    expect(actual.homePage).toBe(expectedHomePage);
    expect(actual.partners).toEqual([expectedPartner]);
    expect(actual.products).toEqual([expectedProduct]);
    expect(actual.services).toEqual([expectedService]);
    expect(partnerService.findPublicPartners).toHaveBeenCalled();
    expect(productService.findPublicProducts).toHaveBeenCalled();
    expect(serviceService.findPublicServices).toHaveBeenCalled();
  });

  it('omits hidden catalog items from the public home read model', async () => {
    partnerService.findPublicPartners.mockResolvedValue({ entities: [], total: 0 });
    productService.findPublicProducts.mockResolvedValue({ entities: [], total: 0 });
    serviceService.findPublicServices.mockResolvedValue({ entities: [], total: 0 });
    const actual = await homePageService.getPublicHomePage();
    expect(actual.partners).toEqual([]);
    expect(actual.products).toEqual([]);
    expect(actual.services).toEqual([]);
  });
});
