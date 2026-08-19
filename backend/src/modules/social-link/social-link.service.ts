import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/common/constants/policy.constants';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { SocialLinkPage } from '@/modules/social-link/defs/social-link-repository.defs';
import {
  CreateSocialLinkServiceInput,
  GetSocialLinksServiceInput,
  UpdateSocialLinkServiceInput,
} from '@/modules/social-link/defs/social-link-service.defs';
import { SocialLinkEntity } from '@/modules/social-link/entity/social-link.entity';
import { SocialLinkRepository } from '@/modules/social-link/repository/social-link.repository';

@Injectable()
export class SocialLinkService {
  constructor(private readonly socialLinkRepository: SocialLinkRepository) {}

  async createSocialLink(input: CreateSocialLinkServiceInput): Promise<SocialLinkEntity> {
    return this.socialLinkRepository.create({
      platform: input.platform,
      url: input.url,
      isVisible: input.isVisible ?? true,
      displayOrder: input.displayOrder ?? 0,
    });
  }

  async findSocialLinkById(id: number): Promise<SocialLinkEntity | null> {
    return this.socialLinkRepository.findById(id);
  }

  async getSocialLinkById(id: number): Promise<SocialLinkEntity> {
    const socialLink = await this.findSocialLinkById(id);
    if (!socialLink) {
      throw new ResourceNotFoundException('SocialLink', id);
    }
    return socialLink;
  }

  async getPublicSocialLinkById(id: number): Promise<SocialLinkEntity> {
    const socialLink = await this.findSocialLinkById(id);
    if (!socialLink || !socialLink.isVisible) {
      throw new ResourceNotFoundException('SocialLink', id);
    }
    return socialLink;
  }

  async findSocialLinks(input: GetSocialLinksServiceInput = {}): Promise<SocialLinkPage> {
    return this.socialLinkRepository.findAll({
      isVisible: input.isVisible,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async findPublicSocialLinks(input: GetSocialLinksServiceInput = {}): Promise<SocialLinkPage> {
    return this.socialLinkRepository.findAll({
      isVisible: true,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async updateSocialLink(input: UpdateSocialLinkServiceInput): Promise<SocialLinkEntity> {
    await this.getSocialLinkById(input.id);
    return this.socialLinkRepository.update({
      id: input.id,
      platform: input.platform,
      url: input.url,
      isVisible: input.isVisible,
      displayOrder: input.displayOrder,
    });
  }

  async deleteSocialLink(id: number): Promise<void> {
    await this.getSocialLinkById(id);
    await this.socialLinkRepository.delete(id);
  }
}
