import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';
import { PartnerService } from '@/modules/partner/partner.service';
import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';
import { ProductCategoryService } from '@/modules/product-category/product-category.service';
import { ProductEntity } from '@/modules/product/entity/product.entity';
import { ProductService } from '@/modules/product/product.service';
import { ProductRepository } from '@/modules/product/repository/product.repository';

describe('ProductService', () => {
  const expectedCategory = new ProductCategoryEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    name: 'Pharmaceutical Products',
    description: null,
    isVisible: true,
    displayOrder: 0,
    color: null,
  });
  const expectedPartner = new PartnerEntity({
    id: 2,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    name: 'Example Pharma',
    shortDescription: 'International pharmaceutical manufacturer',
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
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    name: 'Amoxicillin 500 mg',
    shortDescription: 'Broad-spectrum antibiotic capsules',
    detailedDescription: null,
    manufacturer: 'Example Pharma',
    isVisible: true,
    displayOrder: 0,
    categoryId: 1,
    partnerId: 2,
    imageMediaId: null,
    category: expectedCategory,
    partner: expectedPartner,
  });
  let productService: ProductService;
  let productRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    findAll: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  let productCategoryService: {
    getProductCategoryById: jest.Mock;
  };
  let partnerService: {
    getPartnerById: jest.Mock;
  };
  let mediaService: {
    getMediaById: jest.Mock;
  };

  beforeEach(async () => {
    productRepository = {
      create: jest.fn().mockResolvedValue(expectedProduct),
      findById: jest.fn().mockResolvedValue(expectedProduct),
      findAll: jest.fn().mockResolvedValue({ entities: [expectedProduct], total: 1 }),
      update: jest.fn().mockResolvedValue(expectedProduct),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    productCategoryService = {
      getProductCategoryById: jest.fn().mockResolvedValue(expectedCategory),
    };
    partnerService = {
      getPartnerById: jest.fn().mockResolvedValue(expectedPartner),
    };
    mediaService = {
      getMediaById: jest.fn().mockResolvedValue({ id: 8 }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: ProductRepository, useValue: productRepository },
        { provide: ProductCategoryService, useValue: productCategoryService },
        { provide: PartnerService, useValue: partnerService },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();
    productService = module.get(ProductService);
  });

  it('creates a product with default visibility and optional partner', async () => {
    const actual = await productService.createProduct({
      name: 'Amoxicillin 500 mg',
      shortDescription: 'Broad-spectrum antibiotic capsules',
      categoryId: 1,
      partnerId: 2,
    });
    expect(actual).toBe(expectedProduct);
    expect(productCategoryService.getProductCategoryById).toHaveBeenCalledWith(1);
    expect(partnerService.getPartnerById).toHaveBeenCalledWith(2);
    expect(productRepository.create).toHaveBeenCalledWith({
      name: 'Amoxicillin 500 mg',
      shortDescription: 'Broad-spectrum antibiotic capsules',
      detailedDescription: null,
      manufacturer: null,
      isVisible: true,
      displayOrder: 0,
      categoryId: 1,
      partnerId: 2,
      imageMediaId: null,
    });
  });

  it('lists only visible products in visible categories for the public audience', async () => {
    await productService.findPublicProducts({
      categoryId: 1,
      partnerId: 2,
      search: 'amoxicillin',
      limit: 10,
      offset: 0,
    });
    expect(partnerService.getPartnerById).toHaveBeenCalledWith(2);
    expect(productRepository.findAll).toHaveBeenCalledWith({
      isVisible: true,
      isCategoryVisible: true,
      categoryId: 1,
      partnerId: 2,
      search: 'amoxicillin',
      limit: 10,
      offset: 0,
    });
  });

  it('hides a disabled product from the public get', async () => {
    productRepository.findById.mockResolvedValue(
      new ProductEntity({
        ...expectedProduct,
        isVisible: false,
        category: expectedCategory,
        partner: expectedPartner,
      }),
    );
    await expect(productService.getPublicProductById(1)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
  });

  it('omits a hidden partner from the public product', async () => {
    productRepository.findById.mockResolvedValue(
      new ProductEntity({
        ...expectedProduct,
        category: expectedCategory,
        partner: new PartnerEntity({
          ...expectedPartner,
          isVisible: false,
        }),
      }),
    );
    const actual = await productService.getPublicProductById(1);
    expect(actual.partner).toBeUndefined();
    expect(actual.partnerId).toBeNull();
  });
});
