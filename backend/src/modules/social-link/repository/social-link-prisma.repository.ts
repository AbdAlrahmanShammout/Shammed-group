import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateSocialLinkRepoInput,
  GetSocialLinksRepoInput,
  SocialLinkPage,
  UpdateSocialLinkRepoInput,
} from '@/modules/social-link/defs/social-link-repository.defs';
import { SocialLinkEntity } from '@/modules/social-link/entity/social-link.entity';
import { SocialLinkMapper } from '@/modules/social-link/mapper/social-link.mapper';
import { SocialLinkRepository } from '@/modules/social-link/repository/social-link.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class SocialLinkPrismaRepository implements SocialLinkRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreateSocialLinkRepoInput,
    context?: TransactionContext,
  ): Promise<SocialLinkEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.socialLink.create({
      data: {
        platform: input.platform,
        url: input.url,
        isVisible: input.isVisible,
        displayOrder: input.displayOrder,
      },
    });
    return SocialLinkMapper.toEntity(result);
  }

  async findById(id: number): Promise<SocialLinkEntity | null> {
    const result = await this.prismaProviderService.socialLink.findUnique({
      where: { id },
    });
    if (!result) {
      return null;
    }
    return SocialLinkMapper.toEntity(result);
  }

  async findAll(input: GetSocialLinksRepoInput): Promise<SocialLinkPage> {
    const where: Prisma.SocialLinkWhereInput = {};
    if (input.isVisible !== undefined) {
      where.isVisible = input.isVisible;
    }
    const [results, total] = await this.prismaProviderService.$transaction([
      this.prismaProviderService.socialLink.findMany({
        where,
        orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        take: input.limit,
        skip: input.offset,
      }),
      this.prismaProviderService.socialLink.count({ where }),
    ]);
    return {
      entities: results.map((result) => SocialLinkMapper.toEntity(result)),
      total,
    };
  }

  async update(
    input: UpdateSocialLinkRepoInput,
    context?: TransactionContext,
  ): Promise<SocialLinkEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.socialLink.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
    });
    return SocialLinkMapper.toEntity(result);
  }

  async delete(id: number, context?: TransactionContext): Promise<void> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    await client.socialLink.delete({ where: { id } });
  }

  private buildUpdateData(input: UpdateSocialLinkRepoInput): Prisma.SocialLinkUpdateInput {
    const data: Prisma.SocialLinkUpdateInput = {};
    if (input.platform !== undefined) {
      data.platform = input.platform;
    }
    if (input.url !== undefined) {
      data.url = input.url;
    }
    if (input.isVisible !== undefined) {
      data.isVisible = input.isVisible;
    }
    if (input.displayOrder !== undefined) {
      data.displayOrder = input.displayOrder;
    }
    return data;
  }
}
