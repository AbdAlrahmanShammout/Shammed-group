import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';
import { ProductCategoryLastOccupiedException } from '@/modules/product-category/exceptions/product-category-last-occupied.exception';
import { ProductCategoryOccupiedException } from '@/modules/product-category/exceptions/product-category-occupied.exception';
import { ProductCategoryService } from '@/modules/product-category/product-category.service';
import { ProductCategoryRepository } from '@/modules/product-category/repository/product-category.repository';

describe('ProductCategoryService', () => {
  const expectedProductCategory = new ProductCategoryEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    name: 'Pharmaceutical Products',
    description: null,
    isVisible: true,
    displayOrder: 0,
  });
  let productCategoryService: ProductCategoryService;
  let productCategoryRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    findAll: jest.Mock;
    countAll: jest.Mock;
    countProducts: jest.Mock;
    update: jest.Mock;
    reassignProductsAndDelete: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    productCategoryRepository = {
      create: jest.fn().mockResolvedValue(expectedProductCategory),
      findById: jest.fn().mockResolvedValue(expectedProductCategory),
      findAll: jest.fn().mockResolvedValue({ entities: [expectedProductCategory], total: 1 }),
      countAll: jest.fn().mockResolvedValue(1),
      countProducts: jest.fn().mockResolvedValue(0),
      update: jest.fn().mockResolvedValue(expectedProductCategory),
      reassignProductsAndDelete: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        { provide: ProductCategoryRepository, useValue: productCategoryRepository },
      ],
    }).compile();
    productCategoryService = module.get(ProductCategoryService);
  });

  it('creates a product category with default visibility and order', async () => {
    const actual = await productCategoryService.createProductCategory({
      name: 'Pharmaceutical Products',
    });
    expect(actual).toBe(expectedProductCategory);
    expect(productCategoryRepository.create).toHaveBeenCalledWith({
      name: 'Pharmaceutical Products',
      description: null,
      isVisible: true,
      displayOrder: 0,
    });
  });

  it('lists only visible product categories for the public audience', async () => {
    await productCategoryService.findPublicProductCategories({ limit: 10, offset: 0 });
    expect(productCategoryRepository.findAll).toHaveBeenCalledWith({
      isVisible: true,
      limit: 10,
      offset: 0,
    });
  });

  it('deletes an empty product category', async () => {
    await productCategoryService.deleteProductCategory({ id: 1 });
    expect(productCategoryRepository.delete).toHaveBeenCalledWith(1);
    expect(productCategoryRepository.reassignProductsAndDelete).not.toHaveBeenCalled();
  });

  it('rejects deleting an occupied category without a replacement', async () => {
    productCategoryRepository.countProducts.mockResolvedValue(2);
    productCategoryRepository.countAll.mockResolvedValue(3);
    await expect(productCategoryService.deleteProductCategory({ id: 1 })).rejects.toBeInstanceOf(
      ProductCategoryOccupiedException,
    );
    expect(productCategoryRepository.delete).not.toHaveBeenCalled();
    expect(productCategoryRepository.reassignProductsAndDelete).not.toHaveBeenCalled();
  });

  it('rejects deleting the last occupied category', async () => {
    productCategoryRepository.countProducts.mockResolvedValue(2);
    productCategoryRepository.countAll.mockResolvedValue(1);
    await expect(
      productCategoryService.deleteProductCategory({ id: 1, replacementCategoryId: 2 }),
    ).rejects.toBeInstanceOf(ProductCategoryLastOccupiedException);
    expect(productCategoryRepository.reassignProductsAndDelete).not.toHaveBeenCalled();
  });

  it('reassigns products before deleting an occupied category', async () => {
    productCategoryRepository.countProducts.mockResolvedValue(2);
    productCategoryRepository.countAll.mockResolvedValue(2);
    productCategoryRepository.findById.mockImplementation(async (id: number) => {
      if (id === 1) {
        return expectedProductCategory;
      }
      return new ProductCategoryEntity({
        ...expectedProductCategory,
        id: 2,
        name: 'Medical Devices',
      });
    });
    await productCategoryService.deleteProductCategory({ id: 1, replacementCategoryId: 2 });
    expect(productCategoryRepository.reassignProductsAndDelete).toHaveBeenCalledWith({
      id: 1,
      replacementCategoryId: 2,
    });
  });

  it('hides a disabled product category from the public get', async () => {
    productCategoryRepository.findById.mockResolvedValue(
      new ProductCategoryEntity({
        ...expectedProductCategory,
        isVisible: false,
      }),
    );
    await expect(productCategoryService.getPublicProductCategoryById(1)).rejects.toBeInstanceOf(
      ResourceNotFoundException,
    );
  });
});
