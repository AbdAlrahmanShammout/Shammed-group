import { BaseEntity } from '@/common/base/base.entity';
import { MediaZodType } from '@/modules/media/zod/media.zod';

export class MediaEntity extends BaseEntity {
  originalFileName!: string;
  storedFileName!: string;
  mimeType!: string;
  byteSize!: number;
  storageKey!: string;

  constructor(data: MediaZodType) {
    super();
    Object.assign(this, data);
  }
}
