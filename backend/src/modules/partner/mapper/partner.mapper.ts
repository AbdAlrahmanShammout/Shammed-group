import { MediaMapper } from '@/modules/media/mapper/media.mapper';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';
import type { PartnerType } from '@/modules/partner/types/partner-details-schema.type';

export class PartnerMapper {
  static toEntity(schema: PartnerType): PartnerEntity {
    return new PartnerEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      name: schema.name,
      shortDescription: schema.shortDescription,
      fullDescription: schema.fullDescription ?? null,
      specialization: schema.specialization ?? null,
      websiteUrl: schema.websiteUrl ?? null,
      country: schema.country ?? null,
      isVisible: schema.isVisible,
      displayOrder: schema.displayOrder,
      logoMediaId: schema.logoMediaId ?? null,
      logo: schema.logo ? MediaMapper.toEntity(schema.logo) : undefined,
    });
  }
}
