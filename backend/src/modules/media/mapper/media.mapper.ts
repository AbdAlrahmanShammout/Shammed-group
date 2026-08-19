import { MediaEntity } from '@/modules/media/entity/media.entity';
import type { MediaType } from '@/modules/media/types/media-details-schema.type';

export class MediaMapper {
  static toEntity(schema: MediaType): MediaEntity {
    return new MediaEntity({
      id: schema.id,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      originalFileName: schema.originalFileName,
      storedFileName: schema.storedFileName,
      mimeType: schema.mimeType,
      byteSize: schema.byteSize,
      storageKey: schema.storageKey,
    });
  }
}
