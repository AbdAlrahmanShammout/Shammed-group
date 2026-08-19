import { SocialLinkEntity } from '@/modules/social-link/entity/social-link.entity';
import type { SocialLinkType } from '@/modules/social-link/types/social-link-details-schema.type';

export class SocialLinkMapper {
  static toEntity(schema: SocialLinkType): SocialLinkEntity {
    return new SocialLinkEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      platform: schema.platform,
      url: schema.url,
      isVisible: schema.isVisible,
      displayOrder: schema.displayOrder,
    });
  }
}
