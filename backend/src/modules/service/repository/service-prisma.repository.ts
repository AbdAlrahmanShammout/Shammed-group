import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateServiceRepoInput,
  GetServicesRepoInput,
  ServicePage,
  UpdateServiceRepoInput,
} from '@/modules/service/defs/service-repository.defs';
import { ServiceEntity } from '@/modules/service/entity/service.entity';
import { ServiceMapper } from '@/modules/service/mapper/service.mapper';
import { ServiceRepository } from '@/modules/service/repository/service.repository';
import { serviceDetailsInclude } from '@/modules/service/types/service-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class ServicePrismaRepository implements ServiceRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreateServiceRepoInput,
    context?: TransactionContext,
  ): Promise<ServiceEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.service.create({
      data: {
        title: input.title,
        description: input.description,
        isVisible: input.isVisible,
        displayOrder: input.displayOrder,
        image: input.imageMediaId ? { connect: { id: input.imageMediaId } } : undefined,
      },
      include: serviceDetailsInclude,
    });
    return ServiceMapper.toEntity(result);
  }

  async findById(id: number): Promise<ServiceEntity | null> {
    const result = await this.prismaProviderService.service.findUnique({
      where: { id },
      include: serviceDetailsInclude,
    });
    if (!result) {
      return null;
    }
    return ServiceMapper.toEntity(result);
  }

  async findAll(input: GetServicesRepoInput): Promise<ServicePage> {
    const where: Prisma.ServiceWhereInput = {};
    if (input.isVisible !== undefined) {
      where.isVisible = input.isVisible;
    }
    const [results, total] = await this.prismaProviderService.$transaction([
      this.prismaProviderService.service.findMany({
        where,
        include: serviceDetailsInclude,
        orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        take: input.limit,
        skip: input.offset,
      }),
      this.prismaProviderService.service.count({ where }),
    ]);
    return {
      entities: results.map((result) => ServiceMapper.toEntity(result)),
      total,
    };
  }

  async update(
    input: UpdateServiceRepoInput,
    context?: TransactionContext,
  ): Promise<ServiceEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.service.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
      include: serviceDetailsInclude,
    });
    return ServiceMapper.toEntity(result);
  }

  async delete(id: number, context?: TransactionContext): Promise<void> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    await client.service.delete({ where: { id } });
  }

  private buildUpdateData(input: UpdateServiceRepoInput): Prisma.ServiceUpdateInput {
    const data: Prisma.ServiceUpdateInput = {};
    if (input.title !== undefined) {
      data.title = input.title;
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
    if (input.imageMediaId !== undefined) {
      data.image =
        input.imageMediaId === null
          ? { disconnect: true }
          : { connect: { id: input.imageMediaId } };
    }
    return data;
  }
}
