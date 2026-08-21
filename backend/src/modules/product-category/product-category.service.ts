import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/common/constants/policy.constants';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { ProductCategoryPage } from '@/modules/product-category/defs/product-category-repository.defs';
import {
  CreateProductCategoryServiceInput,
  DeleteProductCategoryServiceInput,
  GetProductCategoriesServiceInput,
  UpdateProductCategoryServiceInput,
} from '@/modules/product-category/defs/product-category-service.defs';
import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';
import { ProductCategoryLastOccupiedException } from '@/modules/product-category/exceptions/product-category-last-occupied.exception';
import { ProductCategoryOccupiedException } from '@/modules/product-category/exceptions/product-category-occupied.exception';
import { ProductCategoryRepository } from '@/modules/product-category/repository/product-category.repository';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly productCategoryRepository: ProductCategoryRepository) {}

  async createProductCategory(
    input: CreateProductCategoryServiceInput,
  ): Promise<ProductCategoryEntity> {
    return this.productCategoryRepository.create({
      name: input.name,
      description: input.description ?? null,
      isVisible: input.isVisible ?? true,
      displayOrder: input.displayOrder ?? 0,
      color: input.color ?? null,
    });
  }

  async findProductCategoryById(id: number): Promise<ProductCategoryEntity | null> {
    return this.productCategoryRepository.findById(id);
  }

  async getProductCategoryById(id: number): Promise<ProductCategoryEntity> {
    const productCategory = await this.findProductCategoryById(id);
    if (!productCategory) {
      throw new ResourceNotFoundException('ProductCategory', id);
    }
    return productCategory;
  }

  async getPublicProductCategoryById(id: number): Promise<ProductCategoryEntity> {
    const productCategory = await this.findProductCategoryById(id);
    if (!productCategory || !productCategory.isVisible) {
      throw new ResourceNotFoundException('ProductCategory', id);
    }
    return productCategory;
  }

  async findProductCategories(
    input: GetProductCategoriesServiceInput = {},
  ): Promise<ProductCategoryPage> {
    return this.productCategoryRepository.findAll({
      isVisible: input.isVisible,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async findPublicProductCategories(
    input: GetProductCategoriesServiceInput = {},
  ): Promise<ProductCategoryPage> {
    return this.productCategoryRepository.findAll({
      isVisible: true,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async updateProductCategory(
    input: UpdateProductCategoryServiceInput,
  ): Promise<ProductCategoryEntity> {
    await this.getProductCategoryById(input.id);
    return this.productCategoryRepository.update({
      id: input.id,
      name: input.name,
      description: input.description,
      isVisible: input.isVisible,
      displayOrder: input.displayOrder,
      color: input.color,
    });
  }

  async deleteProductCategory(input: DeleteProductCategoryServiceInput): Promise<void> {
    await this.getProductCategoryById(input.id);
    const productCount = await this.productCategoryRepository.countProducts(input.id);
    if (productCount === 0) {
      await this.productCategoryRepository.delete(input.id);
      return;
    }
    const replacementCategoryId = await this.assertCanDeleteOccupiedCategory(input);
    await this.productCategoryRepository.reassignProductsAndDelete({
      id: input.id,
      replacementCategoryId,
    });
  }

  private async assertCanDeleteOccupiedCategory(
    input: DeleteProductCategoryServiceInput,
  ): Promise<number> {
    const categoryCount = await this.productCategoryRepository.countAll();
    if (categoryCount < 2) {
      throw new ProductCategoryLastOccupiedException();
    }
    const replacementCategoryId = input.replacementCategoryId;
    if (replacementCategoryId === undefined || replacementCategoryId === input.id) {
      throw new ProductCategoryOccupiedException();
    }
    await this.getProductCategoryById(replacementCategoryId);
    return replacementCategoryId;
  }
}
