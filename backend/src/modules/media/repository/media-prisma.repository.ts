import { Injectable } from '@nestjs/common';

import { TransactionContext } from '@/common/base/transaction-context';
import { CreateMediaRepoInput } from '@/modules/media/defs/media-repository.defs';
import { MediaEntity } from '@/modules/media/entity/media.entity';
import { MediaMapper } from '@/modules/media/mapper/media.mapper';
import { MediaRepository } from '@/modules/media/repository/media.repository';
import { mediaDetailsInclude } from '@/modules/media/types/media-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class MediaPrismaRepository implements MediaRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(input: CreateMediaRepoInput, context?: TransactionContext): Promise<MediaEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.media.create({
      data: {
        originalFileName: input.originalFileName,
        storedFileName: input.storedFileName,
        mimeType: input.mimeType,
        byteSize: input.byteSize,
        storageKey: input.storageKey,
      },
      include: mediaDetailsInclude,
    });
    return MediaMapper.toEntity(result);
  }

  async findById(id: number): Promise<MediaEntity | null> {
    const result = await this.prismaProviderService.media.findUnique({
      where: { id },
      include: mediaDetailsInclude,
    });
    if (!result) {
      return null;
    }
    return MediaMapper.toEntity(result);
  }

  async findAll(
    limit: number,
    offset: number,
  ): Promise<{ entities: MediaEntity[]; total: number }> {
    const [results, total] = await Promise.all([
      this.prismaProviderService.media.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: mediaDetailsInclude,
      }),
      this.prismaProviderService.media.count(),
    ]);
    return { entities: results.map(MediaMapper.toEntity), total };
  }

  async deleteById(id: number): Promise<void> {
    await this.prismaProviderService.media.delete({ where: { id } });
  }

  async findUnreferenced(): Promise<MediaEntity[]> {
    const results = await this.prismaProviderService.media.findMany({
      where: {
        siteSettingsLogo: null,
        siteSettingsFavicon: null,
        partnerLogo: null,
        productImage: null,
        serviceImage: null,
        homePageHeroImage: null,
        homePageAboutImage: null,
        homePageWhyImage: null,
        aboutPageOverviewImage: null,
      },
      include: mediaDetailsInclude,
    });
    return results.map(MediaMapper.toEntity);
  }
}
