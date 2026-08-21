import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateProductCategoryRepoInput,
  GetProductCategoriesRepoInput,
  ProductCategoryPage,
  ReassignProductCategoryRepoInput,
  UpdateProductCategoryRepoInput,
} from '@/modules/product-category/defs/product-category-repository.defs';
import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';
import { ProductCategoryMapper } from '@/modules/product-category/mapper/product-category.mapper';
import { ProductCategoryRepository } from '@/modules/product-category/repository/product-category.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class ProductCategoryPrismaRepository implements ProductCategoryRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreateProductCategoryRepoInput,
    context?: TransactionContext,
  ): Promise<ProductCategoryEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.productCategory.create({
      data: {
        name: input.name,
        description: input.description,
        isVisible: input.isVisible,
        displayOrder: input.displayOrder,
        color: input.color,
      },
    });
    return ProductCategoryMapper.toEntity(result);
  }

  async findById(id: number): Promise<ProductCategoryEntity | null> {
    const result = await this.prismaProviderService.productCategory.findUnique({
      where: { id },
    });
    if (!result) {
      return null;
    }
    return ProductCategoryMapper.toEntity(result);
  }

  async findAll(input: GetProductCategoriesRepoInput): Promise<ProductCategoryPage> {
    const where: Prisma.ProductCategoryWhereInput = {};
    if (input.isVisible !== undefined) {
      where.isVisible = input.isVisible;
    }
    const [results, total] = await this.prismaProviderService.$transaction([
      this.prismaProviderService.productCategory.findMany({
        where,
        orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        take: input.limit,
        skip: input.offset,
      }),
      this.prismaProviderService.productCategory.count({ where }),
    ]);
    return {
      entities: results.map((result) => ProductCategoryMapper.toEntity(result)),
      total,
    };
  }

  async countAll(): Promise<number> {
    return this.prismaProviderService.productCategory.count();
  }

  async countProducts(categoryId: number): Promise<number> {
    return this.prismaProviderService.product.count({ where: { categoryId } });
  }

  async update(
    input: UpdateProductCategoryRepoInput,
    context?: TransactionContext,
  ): Promise<ProductCategoryEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.productCategory.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
    });
    return ProductCategoryMapper.toEntity(result);
  }

  async reassignProductsAndDelete(
    input: ReassignProductCategoryRepoInput,
    context?: TransactionContext,
  ): Promise<void> {
    if (context) {
      await this.executeReassignProductsAndDelete(
        resolvePrismaClient(this.prismaProviderService, context),
        input,
      );
      return;
    }
    await this.prismaProviderService.$transaction((tx) =>
      this.executeReassignProductsAndDelete(tx, input),
    );
  }

  async delete(id: number, context?: TransactionContext): Promise<void> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    await client.productCategory.delete({ where: { id } });
  }

  private async executeReassignProductsAndDelete(
    client: PrismaProviderService | Prisma.TransactionClient,
    input: ReassignProductCategoryRepoInput,
  ): Promise<void> {
    await client.product.updateMany({
      where: { categoryId: input.id },
      data: { categoryId: input.replacementCategoryId },
    });
    await client.productCategory.delete({ where: { id: input.id } });
  }

  private buildUpdateData(
    input: UpdateProductCategoryRepoInput,
  ): Prisma.ProductCategoryUpdateInput {
    const data: Prisma.ProductCategoryUpdateInput = {};
    if (input.name !== undefined) {
      data.name = input.name;
    }
    if (input.description !== undefined) {
      data.description = input.description;
    }
    if (input.isVisible !== undefined) {
      data.isVisible = input.isVisible;
    }
    if (input.displayOrder !== undefined) {
      data.displayOrder = input.displayOrder;
    }
    if (input.color !== undefined) {
      data.color = input.color;
    }
    return data;
  }
}
