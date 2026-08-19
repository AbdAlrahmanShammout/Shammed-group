import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreatePartnerRepoInput,
  GetPartnersRepoInput,
  PartnerPage,
  UpdatePartnerRepoInput,
} from '@/modules/partner/defs/partner-repository.defs';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';
import { PartnerMapper } from '@/modules/partner/mapper/partner.mapper';
import { PartnerRepository } from '@/modules/partner/repository/partner.repository';
import { partnerDetailsInclude } from '@/modules/partner/types/partner-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class PartnerPrismaRepository implements PartnerRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreatePartnerRepoInput,
    context?: TransactionContext,
  ): Promise<PartnerEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.partner.create({
      data: {
        name: input.name,
        shortDescription: input.shortDescription,
        fullDescription: input.fullDescription,
        specialization: input.specialization,
        websiteUrl: input.websiteUrl,
        country: input.country,
        isVisible: input.isVisible,
        displayOrder: input.displayOrder,
        logo: input.logoMediaId ? { connect: { id: input.logoMediaId } } : undefined,
      },
      include: partnerDetailsInclude,
    });
    return PartnerMapper.toEntity(result);
  }

  async findById(id: number): Promise<PartnerEntity | null> {
    const result = await this.prismaProviderService.partner.findUnique({
      where: { id },
      include: partnerDetailsInclude,
    });
    if (!result) {
      return null;
    }
    return PartnerMapper.toEntity(result);
  }

  async findAll(input: GetPartnersRepoInput): Promise<PartnerPage> {
    const where: Prisma.PartnerWhereInput = {};
    if (input.isVisible !== undefined) {
      where.isVisible = input.isVisible;
    }
    const [results, total] = await this.prismaProviderService.$transaction([
      this.prismaProviderService.partner.findMany({
        where,
        include: partnerDetailsInclude,
        orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        take: input.limit,
        skip: input.offset,
      }),
      this.prismaProviderService.partner.count({ where }),
    ]);
    return {
      entities: results.map((result) => PartnerMapper.toEntity(result)),
      total,
    };
  }

  async update(
    input: UpdatePartnerRepoInput,
    context?: TransactionContext,
  ): Promise<PartnerEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.partner.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
      include: partnerDetailsInclude,
    });
    return PartnerMapper.toEntity(result);
  }

  async delete(id: number, context?: TransactionContext): Promise<void> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    await client.partner.delete({ where: { id } });
  }

  private buildUpdateData(input: UpdatePartnerRepoInput): Prisma.PartnerUpdateInput {
    const data: Prisma.PartnerUpdateInput = {};
    if (input.name !== undefined) {
      data.name = input.name;
    }
    if (input.shortDescription !== undefined) {
      data.shortDescription = input.shortDescription;
    }
    if (input.fullDescription !== undefined) {
      data.fullDescription = input.fullDescription;
    }
    if (input.specialization !== undefined) {
      data.specialization = input.specialization;
    }
    if (input.websiteUrl !== undefined) {
      data.websiteUrl = input.websiteUrl;
    }
    if (input.country !== undefined) {
      data.country = input.country;
    }
    if (input.isVisible !== undefined) {
      data.isVisible = input.isVisible;
    }
    if (input.displayOrder !== undefined) {
      data.displayOrder = input.displayOrder;
    }
    if (input.logoMediaId !== undefined) {
      data.logo =
        input.logoMediaId === null ? { disconnect: true } : { connect: { id: input.logoMediaId } };
    }
    return data;
  }
}
