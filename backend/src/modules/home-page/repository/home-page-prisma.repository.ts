import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateHomePageRepoInput,
  UpdateHomePageRepoInput,
} from '@/modules/home-page/defs/home-page-repository.defs';
import { HomePageEntity } from '@/modules/home-page/entity/home-page.entity';
import { HOME_PAGE_SINGLETON_KEY } from '@/modules/home-page/home-page.constants';
import { HomePageMapper } from '@/modules/home-page/mapper/home-page.mapper';
import { HomePageRepository } from '@/modules/home-page/repository/home-page.repository';
import { homePageDetailsInclude } from '@/modules/home-page/types/home-page-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class HomePagePrismaRepository implements HomePageRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreateHomePageRepoInput,
    context?: TransactionContext,
  ): Promise<HomePageEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.homePage.create({
      data: {
        singletonKey: HOME_PAGE_SINGLETON_KEY,
        heroTitle: input.heroTitle,
        heroDescription: input.heroDescription,
        primaryCtaText: input.primaryCtaText,
        primaryCtaUrl: input.primaryCtaUrl,
        secondaryCtaText: input.secondaryCtaText,
        secondaryCtaUrl: input.secondaryCtaUrl,
        aboutPreviewTitle: input.aboutPreviewTitle,
        aboutPreviewDescription: input.aboutPreviewDescription,
        aboutPreviewCtaText: input.aboutPreviewCtaText,
        aboutPreviewCtaUrl: input.aboutPreviewCtaUrl,
        partnersSectionTitle: input.partnersSectionTitle,
        partnersSectionDescription: input.partnersSectionDescription,
        productsSectionTitle: input.productsSectionTitle,
        productsSectionDescription: input.productsSectionDescription,
        servicesSectionTitle: input.servicesSectionTitle,
        servicesSectionDescription: input.servicesSectionDescription,
        whyTitle: input.whyTitle,
        whyDescription: input.whyDescription,
        whyEyebrow: input.whyEyebrow,
        whyReason1Title: input.whyReason1Title,
        whyReason1Description: input.whyReason1Description,
        whyReason2Title: input.whyReason2Title,
        whyReason2Description: input.whyReason2Description,
        whyReason3Title: input.whyReason3Title,
        whyReason3Description: input.whyReason3Description,
        whyReason4Title: input.whyReason4Title,
        whyReason4Description: input.whyReason4Description,
        heroEyebrow: input.heroEyebrow,
        aboutEyebrow: input.aboutEyebrow,
        aboutMetric1Value: input.aboutMetric1Value,
        aboutMetric1Label: input.aboutMetric1Label,
        aboutMetric2Value: input.aboutMetric2Value,
        aboutMetric2Label: input.aboutMetric2Label,
        aboutMetric3Value: input.aboutMetric3Value,
        aboutMetric3Label: input.aboutMetric3Label,
        contactSectionTitle: input.contactSectionTitle,
        contactSectionDescription: input.contactSectionDescription,
        heroImage: input.heroImageMediaId ? { connect: { id: input.heroImageMediaId } } : undefined,
        aboutPreviewImage: input.aboutPreviewImageMediaId
          ? { connect: { id: input.aboutPreviewImageMediaId } }
          : undefined,
        whyImage: input.whyImageMediaId ? { connect: { id: input.whyImageMediaId } } : undefined,
      },
      include: homePageDetailsInclude,
    });
    return HomePageMapper.toEntity(result);
  }

  async findSingleton(): Promise<HomePageEntity | null> {
    const result = await this.prismaProviderService.homePage.findUnique({
      where: { singletonKey: HOME_PAGE_SINGLETON_KEY },
      include: homePageDetailsInclude,
    });
    if (!result) {
      return null;
    }
    return HomePageMapper.toEntity(result);
  }

  async update(
    input: UpdateHomePageRepoInput,
    context?: TransactionContext,
  ): Promise<HomePageEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.homePage.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
      include: homePageDetailsInclude,
    });
    return HomePageMapper.toEntity(result);
  }

  private buildUpdateData(input: UpdateHomePageRepoInput): Prisma.HomePageUpdateInput {
    const data: Prisma.HomePageUpdateInput = {};
    if (input.heroTitle !== undefined) {
      data.heroTitle = input.heroTitle;
    }
    if (input.heroDescription !== undefined) {
      data.heroDescription = input.heroDescription;
    }
    if (input.primaryCtaText !== undefined) {
      data.primaryCtaText = input.primaryCtaText;
    }
    if (input.primaryCtaUrl !== undefined) {
      data.primaryCtaUrl = input.primaryCtaUrl;
    }
    if (input.secondaryCtaText !== undefined) {
      data.secondaryCtaText = input.secondaryCtaText;
    }
    if (input.secondaryCtaUrl !== undefined) {
      data.secondaryCtaUrl = input.secondaryCtaUrl;
    }
    if (input.aboutPreviewTitle !== undefined) {
      data.aboutPreviewTitle = input.aboutPreviewTitle;
    }
    if (input.aboutPreviewDescription !== undefined) {
      data.aboutPreviewDescription = input.aboutPreviewDescription;
    }
    if (input.aboutPreviewCtaText !== undefined) {
      data.aboutPreviewCtaText = input.aboutPreviewCtaText;
    }
    if (input.aboutPreviewCtaUrl !== undefined) {
      data.aboutPreviewCtaUrl = input.aboutPreviewCtaUrl;
    }
    if (input.partnersSectionTitle !== undefined) {
      data.partnersSectionTitle = input.partnersSectionTitle;
    }
    if (input.partnersSectionDescription !== undefined) {
      data.partnersSectionDescription = input.partnersSectionDescription;
    }
    if (input.productsSectionTitle !== undefined) {
      data.productsSectionTitle = input.productsSectionTitle;
    }
    if (input.productsSectionDescription !== undefined) {
      data.productsSectionDescription = input.productsSectionDescription;
    }
    if (input.servicesSectionTitle !== undefined) {
      data.servicesSectionTitle = input.servicesSectionTitle;
    }
    if (input.servicesSectionDescription !== undefined) {
      data.servicesSectionDescription = input.servicesSectionDescription;
    }
    if (input.whyTitle !== undefined) {
      data.whyTitle = input.whyTitle;
    }
    if (input.whyDescription !== undefined) {
      data.whyDescription = input.whyDescription;
    }
    if (input.whyEyebrow !== undefined) {
      data.whyEyebrow = input.whyEyebrow;
    }
    if (input.whyReason1Title !== undefined) {
      data.whyReason1Title = input.whyReason1Title;
    }
    if (input.whyReason1Description !== undefined) {
      data.whyReason1Description = input.whyReason1Description;
    }
    if (input.whyReason2Title !== undefined) {
      data.whyReason2Title = input.whyReason2Title;
    }
    if (input.whyReason2Description !== undefined) {
      data.whyReason2Description = input.whyReason2Description;
    }
    if (input.whyReason3Title !== undefined) {
      data.whyReason3Title = input.whyReason3Title;
    }
    if (input.whyReason3Description !== undefined) {
      data.whyReason3Description = input.whyReason3Description;
    }
    if (input.whyReason4Title !== undefined) {
      data.whyReason4Title = input.whyReason4Title;
    }
    if (input.whyReason4Description !== undefined) {
      data.whyReason4Description = input.whyReason4Description;
    }
    if (input.heroEyebrow !== undefined) {
      data.heroEyebrow = input.heroEyebrow;
    }
    if (input.aboutEyebrow !== undefined) {
      data.aboutEyebrow = input.aboutEyebrow;
    }
    if (input.aboutMetric1Value !== undefined) {
      data.aboutMetric1Value = input.aboutMetric1Value;
    }
    if (input.aboutMetric1Label !== undefined) {
      data.aboutMetric1Label = input.aboutMetric1Label;
    }
    if (input.aboutMetric2Value !== undefined) {
      data.aboutMetric2Value = input.aboutMetric2Value;
    }
    if (input.aboutMetric2Label !== undefined) {
      data.aboutMetric2Label = input.aboutMetric2Label;
    }
    if (input.aboutMetric3Value !== undefined) {
      data.aboutMetric3Value = input.aboutMetric3Value;
    }
    if (input.aboutMetric3Label !== undefined) {
      data.aboutMetric3Label = input.aboutMetric3Label;
    }
    if (input.contactSectionTitle !== undefined) {
      data.contactSectionTitle = input.contactSectionTitle;
    }
    if (input.contactSectionDescription !== undefined) {
      data.contactSectionDescription = input.contactSectionDescription;
    }
    if (input.heroImageMediaId !== undefined) {
      data.heroImage =
        input.heroImageMediaId === null
          ? { disconnect: true }
          : { connect: { id: input.heroImageMediaId } };
    }
    if (input.aboutPreviewImageMediaId !== undefined) {
      data.aboutPreviewImage =
        input.aboutPreviewImageMediaId === null
          ? { disconnect: true }
          : { connect: { id: input.aboutPreviewImageMediaId } };
    }
    if (input.whyImageMediaId !== undefined) {
      data.whyImage =
        input.whyImageMediaId === null
          ? { disconnect: true }
          : { connect: { id: input.whyImageMediaId } };
    }
    return data;
  }
}
