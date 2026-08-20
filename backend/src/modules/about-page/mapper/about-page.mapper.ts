import { AboutPageEntity } from '@/modules/about-page/entity/about-page.entity';
import type { AboutPageType } from '@/modules/about-page/types/about-page-details-schema.type';
import { MediaMapper } from '@/modules/media/mapper/media.mapper';

export class AboutPageMapper {
  static toEntity(schema: AboutPageType): AboutPageEntity {
    return new AboutPageEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      overview: schema.overview,
      overviewImageMediaId: schema.overviewImageMediaId ?? null,
      vision: schema.vision,
      mission: schema.mission,
      values: schema.values,
      capabilities: schema.capabilities,
      overviewImage: schema.overviewImage ? MediaMapper.toEntity(schema.overviewImage) : undefined,
    });
  }
}
