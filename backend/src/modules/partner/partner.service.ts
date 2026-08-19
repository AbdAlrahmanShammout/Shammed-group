import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/common/constants/policy.constants';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
import { PartnerPage } from '@/modules/partner/defs/partner-repository.defs';
import {
  CreatePartnerServiceInput,
  GetPartnersServiceInput,
  UpdatePartnerServiceInput,
} from '@/modules/partner/defs/partner-service.defs';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';
import { PartnerRepository } from '@/modules/partner/repository/partner.repository';

@Injectable()
export class PartnerService {
  constructor(
    private readonly partnerRepository: PartnerRepository,
    private readonly mediaService: MediaService,
  ) {}

  async createPartner(input: CreatePartnerServiceInput): Promise<PartnerEntity> {
    await this.assertMediaReference(input.logoMediaId);
    return this.partnerRepository.create({
      name: input.name,
      shortDescription: input.shortDescription,
      fullDescription: input.fullDescription ?? null,
      specialization: input.specialization ?? null,
      websiteUrl: input.websiteUrl ?? null,
      country: input.country ?? null,
      isVisible: input.isVisible ?? true,
      displayOrder: input.displayOrder ?? 0,
      logoMediaId: input.logoMediaId ?? null,
    });
  }

  async findPartnerById(id: number): Promise<PartnerEntity | null> {
    return this.partnerRepository.findById(id);
  }

  async getPartnerById(id: number): Promise<PartnerEntity> {
    const partner = await this.findPartnerById(id);
    if (!partner) {
      throw new ResourceNotFoundException('Partner', id);
    }
    return partner;
  }

  async getPublicPartnerById(id: number): Promise<PartnerEntity> {
    const partner = await this.findPartnerById(id);
    if (!partner || !partner.isVisible) {
      throw new ResourceNotFoundException('Partner', id);
    }
    return partner;
  }

  async findPartners(input: GetPartnersServiceInput = {}): Promise<PartnerPage> {
    return this.partnerRepository.findAll({
      isVisible: input.isVisible,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async findPublicPartners(input: GetPartnersServiceInput = {}): Promise<PartnerPage> {
    return this.partnerRepository.findAll({
      isVisible: true,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async updatePartner(input: UpdatePartnerServiceInput): Promise<PartnerEntity> {
    await this.getPartnerById(input.id);
    await this.assertMediaReference(input.logoMediaId);
    return this.partnerRepository.update({
      id: input.id,
      name: input.name,
      shortDescription: input.shortDescription,
      fullDescription: input.fullDescription,
      specialization: input.specialization,
      websiteUrl: input.websiteUrl,
      country: input.country,
      isVisible: input.isVisible,
      displayOrder: input.displayOrder,
      logoMediaId: input.logoMediaId,
    });
  }

  async deletePartner(id: number): Promise<void> {
    await this.getPartnerById(id);
    await this.partnerRepository.delete(id);
  }

  private async assertMediaReference(mediaId?: number | null): Promise<void> {
    if (mediaId === undefined || mediaId === null) {
      return;
    }
    await this.mediaService.getMediaById(mediaId);
  }
}
