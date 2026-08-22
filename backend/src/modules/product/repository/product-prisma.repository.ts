import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateProductRepoInput,
  GetProductsRepoInput,
  ProductPage,
  UpdateProductRepoInput,
} from '@/modules/product/defs/product-repository.defs';
import { ProductEntity } from '@/modules/product/entity/product.entity';
import { ProductMapper } from '@/modules/product/mapper/product.mapper';
import { ProductRepository } from '@/modules/product/repository/product.repository';
import { productDetailsInclude } from '@/modules/product/types/product-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class ProductPrismaRepository implements ProductRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreateProductRepoInput,
    context?: TransactionContext,
  ): Promise<ProductEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.product.create({
      data: {
        name: input.name,
        shortDescription: input.shortDescription,
        detailedDescription: input.detailedDescription,
        manufacturer: input.manufacturer,
        isVisible: input.isVisible,
        displayOrder: input.displayOrder,
        category: { connect: { id: input.categoryId } },
        partner: input.partnerId ? { connect: { id: input.partnerId } } : undefined,
        image: input.imageMediaId ? { connect: { id: input.imageMediaId } } : undefined,
      },
      include: productDetailsInclude,
    });
    return ProductMapper.toEntity(result);
  }

  async findById(id: number): Promise<ProductEntity | null> {
    const result = await this.prismaProviderService.product.findUnique({
      where: { id },
      include: productDetailsInclude,
    });
    if (!result) {
      return null;
    }
    return ProductMapper.toEntity(result);
  }

  async findAll(input: GetProductsRepoInput): Promise<ProductPage> {
    const where = this.buildWhere(input);
    const [results, total] = await this.prismaProviderService.$transaction([
      this.prismaProviderService.product.findMany({
        where,
        include: productDetailsInclude,
        orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        take: input.limit,
        skip: input.offset,
      }),
      this.prismaProviderService.product.count({ where }),
    ]);
    return {
      entities: results.map((result) => ProductMapper.toEntity(result)),
      total,
    };
  }

  async update(
    input: UpdateProductRepoInput,
    context?: TransactionContext,
  ): Promise<ProductEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.product.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
      include: productDetailsInclude,
    });
    return ProductMapper.toEntity(result);
  }

  async delete(id: number, context?: TransactionContext): Promise<void> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    await client.product.delete({ where: { id } });
  }

  private buildWhere(input: GetProductsRepoInput): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};
    if (input.isVisible !== undefined) {
      where.isVisible = input.isVisible;
    }
    if (input.categoryId !== undefined) {
      where.categoryId = input.categoryId;
    }
    if (input.isCategoryVisible !== undefined) {
      where.category = { isVisible: input.isCategoryVisible };
    }
    if (input.partnerId !== undefined) {
      where.partnerId = input.partnerId;
    }
    if (input.search !== undefined) {
      where.OR = [
        { name: { contains: input.search, mode: 'insensitive' } },
        { shortDescription: { contains: input.search, mode: 'insensitive' } },
        { detailedDescription: { contains: input.search, mode: 'insensitive' } },
        { manufacturer: { contains: input.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private buildUpdateData(input: UpdateProductRepoInput): Prisma.ProductUpdateInput {
    const data: Prisma.ProductUpdateInput = {};
    if (input.name !== undefined) {
      data.name = input.name;
    }
    if (input.shortDescription !== undefined) {
      data.shortDescription = input.shortDescription;
    }
    if (input.detailedDescription !== undefined) {
      data.detailedDescription = input.detailedDescription;
    }
    if (input.manufacturer !== undefined) {
      data.manufacturer = input.manufacturer;
    }
    if (input.isVisible !== undefined) {
      data.isVisible = input.isVisible;
    }
    if (input.displayOrder !== undefined) {
      data.displayOrder = input.displayOrder;
    }
    if (input.categoryId !== undefined) {
      data.category = { connect: { id: input.categoryId } };
    }
    if (input.partnerId !== undefined) {
      data.partner =
        input.partnerId === null ? { disconnect: true } : { connect: { id: input.partnerId } };
    }
    if (input.imageMediaId !== undefined) {
      data.image =
        input.imageMediaId === null
          ? { disconnect: true }
          : { connect: { id: input.imageMediaId } };
    }
    return data;
  }
}
