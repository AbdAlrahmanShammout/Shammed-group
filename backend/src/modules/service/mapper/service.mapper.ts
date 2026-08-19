import { MediaMapper } from '@/modules/media/mapper/media.mapper';
import { ServiceEntity } from '@/modules/service/entity/service.entity';
import type { ServiceType } from '@/modules/service/types/service-details-schema.type';

export class ServiceMapper {
  static toEntity(schema: ServiceType): ServiceEntity {
    return new ServiceEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      title: schema.title,
      description: schema.description,
      isVisible: schema.isVisible,
      displayOrder: schema.displayOrder,
      imageMediaId: schema.imageMediaId ?? null,
      image: schema.image ? MediaMapper.toEntity(schema.image) : undefined,
    });
  }
}
