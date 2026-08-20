import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import { ABOUT_PAGE_SINGLETON_KEY } from '@/modules/about-page/about-page.constants';
import {
  CreateAboutPageRepoInput,
  UpdateAboutPageRepoInput,
} from '@/modules/about-page/defs/about-page-repository.defs';
import { AboutPageEntity } from '@/modules/about-page/entity/about-page.entity';
import { AboutPageMapper } from '@/modules/about-page/mapper/about-page.mapper';
import { AboutPageRepository } from '@/modules/about-page/repository/about-page.repository';
import { aboutPageDetailsInclude } from '@/modules/about-page/types/about-page-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class AboutPagePrismaRepository implements AboutPageRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreateAboutPageRepoInput,
    context?: TransactionContext,
  ): Promise<AboutPageEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.aboutPage.create({
      data: {
        singletonKey: ABOUT_PAGE_SINGLETON_KEY,
        overview: input.overview,
        vision: input.vision,
        mission: input.mission,
        values: input.values,
        capabilities: input.capabilities,
        overviewImage: input.overviewImageMediaId
          ? { connect: { id: input.overviewImageMediaId } }
          : undefined,
      },
      include: aboutPageDetailsInclude,
    });
    return AboutPageMapper.toEntity(result);
  }

  async findSingleton(): Promise<AboutPageEntity | null> {
    const result = await this.prismaProviderService.aboutPage.findUnique({
      where: { singletonKey: ABOUT_PAGE_SINGLETON_KEY },
      include: aboutPageDetailsInclude,
    });
    if (!result) {
      return null;
    }
    return AboutPageMapper.toEntity(result);
  }

  async update(
    input: UpdateAboutPageRepoInput,
    context?: TransactionContext,
  ): Promise<AboutPageEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.aboutPage.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
      include: aboutPageDetailsInclude,
    });
    return AboutPageMapper.toEntity(result);
  }

  private buildUpdateData(input: UpdateAboutPageRepoInput): Prisma.AboutPageUpdateInput {
    const data: Prisma.AboutPageUpdateInput = {};
    if (input.overview !== undefined) {
      data.overview = input.overview;
    }
    if (input.vision !== undefined) {
      data.vision = input.vision;
    }
    if (input.mission !== undefined) {
      data.mission = input.mission;
    }
    if (input.values !== undefined) {
      data.values = input.values;
    }
    if (input.capabilities !== undefined) {
      data.capabilities = input.capabilities;
    }
    if (input.overviewImageMediaId !== undefined) {
      data.overviewImage =
        input.overviewImageMediaId === null
          ? { disconnect: true }
          : { connect: { id: input.overviewImageMediaId } };
    }
    return data;
  }
}
