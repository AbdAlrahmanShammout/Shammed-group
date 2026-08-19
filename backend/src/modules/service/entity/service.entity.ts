import { BaseEntity } from '@/common/base/base.entity';
import { MediaEntity } from '@/modules/media/entity/media.entity';
import { ServiceZodType } from '@/modules/service/zod/service.zod';

export class ServiceEntity extends BaseEntity {
  title!: string;
  description!: string;
  isVisible!: boolean;
  displayOrder!: number;
  imageMediaId!: number | null;
  image?: MediaEntity;

  constructor(data: ServiceZodType) {
    super();
    Object.assign(this, data);
  }
}
