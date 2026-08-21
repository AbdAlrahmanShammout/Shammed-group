import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateSiteSettingsRepoInput,
  UpdateSiteSettingsRepoInput,
} from '@/modules/site-settings/defs/site-settings-repository.defs';
import { SiteSettingsEntity } from '@/modules/site-settings/entity/site-settings.entity';
import { SiteSettingsMapper } from '@/modules/site-settings/mapper/site-settings.mapper';
import { SiteSettingsRepository } from '@/modules/site-settings/repository/site-settings.repository';
import { siteSettingsDetailsInclude } from '@/modules/site-settings/types/site-settings-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class SiteSettingsPrismaRepository implements SiteSettingsRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreateSiteSettingsRepoInput,
    context?: TransactionContext,
  ): Promise<SiteSettingsEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.siteSettings.create({
      data: {
        companyName: input.companyName,
        companyNameEnglish: input.companyNameEnglish,
        companyNameArabic: input.companyNameArabic,
        email: input.email,
        phone: input.phone,
        whatsApp: input.whatsApp,
        address: input.address,
        logo: input.logoMediaId ? { connect: { id: input.logoMediaId } } : undefined,
        favicon: input.faviconMediaId ? { connect: { id: input.faviconMediaId } } : undefined,
        placeholder: input.placeholderMediaId
          ? { connect: { id: input.placeholderMediaId } }
          : undefined,
        primaryColor: input.primaryColor,
        accentColor: input.accentColor,
        backgroundColor: input.backgroundColor,
        textColor: input.textColor,
        secondaryColor: input.secondaryColor,
        borderColor: input.borderColor,
      },
      include: siteSettingsDetailsInclude,
    });
    return SiteSettingsMapper.toEntity(result);
  }

  async findSingleton(): Promise<SiteSettingsEntity | null> {
    const result = await this.prismaProviderService.siteSettings.findFirst({
      orderBy: { id: 'asc' },
      include: siteSettingsDetailsInclude,
    });
    if (!result) {
      return null;
    }
    return SiteSettingsMapper.toEntity(result);
  }

  async update(
    input: UpdateSiteSettingsRepoInput,
    context?: TransactionContext,
  ): Promise<SiteSettingsEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.siteSettings.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
      include: siteSettingsDetailsInclude,
    });
    return SiteSettingsMapper.toEntity(result);
  }

  private buildUpdateData(input: UpdateSiteSettingsRepoInput): Prisma.SiteSettingsUpdateInput {
    const data: Prisma.SiteSettingsUpdateInput = {};
    if (input.companyName !== undefined) {
      data.companyName = input.companyName;
    }
    if (input.companyNameEnglish !== undefined) {
      data.companyNameEnglish = input.companyNameEnglish;
    }
    if (input.companyNameArabic !== undefined) {
      data.companyNameArabic = input.companyNameArabic;
    }
    if (input.email !== undefined) {
      data.email = input.email;
    }
    if (input.phone !== undefined) {
      data.phone = input.phone;
    }
    if (input.whatsApp !== undefined) {
      data.whatsApp = input.whatsApp;
    }
    if (input.address !== undefined) {
      data.address = input.address;
    }
    if (input.logoMediaId !== undefined) {
      data.logo =
        input.logoMediaId === null ? { disconnect: true } : { connect: { id: input.logoMediaId } };
    }
    if (input.faviconMediaId !== undefined) {
      data.favicon =
        input.faviconMediaId === null
          ? { disconnect: true }
          : { connect: { id: input.faviconMediaId } };
    }
    if (input.placeholderMediaId !== undefined) {
      data.placeholder =
        input.placeholderMediaId === null
          ? { disconnect: true }
          : { connect: { id: input.placeholderMediaId } };
    }
    if (input.primaryColor !== undefined) data.primaryColor = input.primaryColor;
    if (input.accentColor !== undefined) data.accentColor = input.accentColor;
    if (input.backgroundColor !== undefined) data.backgroundColor = input.backgroundColor;
    if (input.textColor !== undefined) data.textColor = input.textColor;
    if (input.secondaryColor !== undefined) data.secondaryColor = input.secondaryColor;
    if (input.borderColor !== undefined) data.borderColor = input.borderColor;
    return data;
  }
}
