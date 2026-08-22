import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/common/constants/policy.constants';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
import { PartnerService } from '@/modules/partner/partner.service';
import { ProductCategoryService } from '@/modules/product-category/product-category.service';
import { ProductPage } from '@/modules/product/defs/product-repository.defs';
import {
  CreateProductServiceInput,
  GetProductsServiceInput,
  UpdateProductServiceInput,
} from '@/modules/product/defs/product-service.defs';
import { ProductEntity } from '@/modules/product/entity/product.entity';
import { ProductRepository } from '@/modules/product/repository/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productCategoryService: ProductCategoryService,
    private readonly partnerService: PartnerService,
    private readonly mediaService: MediaService,
  ) {}

  async createProduct(input: CreateProductServiceInput): Promise<ProductEntity> {
    await this.productCategoryService.getProductCategoryById(input.categoryId);
    await this.assertPartnerReference(input.partnerId);
    await this.assertMediaReference(input.imageMediaId);
    return this.productRepository.create({
      name: input.name,
      shortDescription: input.shortDescription,
      detailedDescription: input.detailedDescription ?? null,
      manufacturer: input.manufacturer ?? null,
      isVisible: input.isVisible ?? true,
      displayOrder: input.displayOrder ?? 0,
      categoryId: input.categoryId,
      partnerId: input.partnerId ?? null,
      imageMediaId: input.imageMediaId ?? null,
    });
  }

  async findProductById(id: number): Promise<ProductEntity | null> {
    return this.productRepository.findById(id);
  }

  async getProductById(id: number): Promise<ProductEntity> {
    const product = await this.findProductById(id);
    if (!product) {
      throw new ResourceNotFoundException('Product', id);
    }
    return product;
  }

  async getPublicProductById(id: number): Promise<ProductEntity> {
    const product = await this.findProductById(id);
    if (!product || !product.isVisible || product.category?.isVisible === false) {
      throw new ResourceNotFoundException('Product', id);
    }
    return this.hideHiddenPartner(product);
  }

  async findProducts(input: GetProductsServiceInput = {}): Promise<ProductPage> {
    return this.productRepository.findAll({
      isVisible: input.isVisible,
      categoryId: input.categoryId,
      partnerId: input.partnerId,
      search: input.search,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async findPublicProducts(input: GetProductsServiceInput = {}): Promise<ProductPage> {
    await this.assertPartnerReference(input.partnerId);
    const page = await this.productRepository.findAll({
      isVisible: true,
      isCategoryVisible: true,
      categoryId: input.categoryId,
      partnerId: input.partnerId,
      search: input.search,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
    return {
      entities: page.entities.map((product) => this.hideHiddenPartner(product)),
      total: page.total,
    };
  }

  async updateProduct(input: UpdateProductServiceInput): Promise<ProductEntity> {
    await this.getProductById(input.id);
    if (input.categoryId !== undefined) {
      await this.productCategoryService.getProductCategoryById(input.categoryId);
    }
    await this.assertPartnerReference(input.partnerId);
    await this.assertMediaReference(input.imageMediaId);
    return this.productRepository.update({
      id: input.id,
      name: input.name,
      shortDescription: input.shortDescription,
      detailedDescription: input.detailedDescription,
      manufacturer: input.manufacturer,
      isVisible: input.isVisible,
      displayOrder: input.displayOrder,
      categoryId: input.categoryId,
      partnerId: input.partnerId,
      imageMediaId: input.imageMediaId,
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.getProductById(id);
    await this.productRepository.delete(id);
  }

  private hideHiddenPartner(product: ProductEntity): ProductEntity {
    if (!product.partner || product.partner.isVisible) {
      return product;
    }
    return new ProductEntity({
      ...product,
      partnerId: null,
      partner: undefined,
    });
  }

  private async assertPartnerReference(partnerId?: number | null): Promise<void> {
    if (partnerId === undefined || partnerId === null) {
      return;
    }
    await this.partnerService.getPartnerById(partnerId);
  }

  private async assertMediaReference(mediaId?: number | null): Promise<void> {
    if (mediaId === undefined || mediaId === null) {
      return;
    }
    await this.mediaService.getMediaById(mediaId);
  }
}
