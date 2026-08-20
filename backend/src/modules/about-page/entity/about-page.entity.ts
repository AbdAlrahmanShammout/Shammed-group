import { AboutPageZodType } from '@/modules/about-page/zod/about-page.zod';
import { BaseEntity } from '@/common/base/base.entity';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export class AboutPageEntity extends BaseEntity {
  overview!: string;
  overviewImageMediaId!: number | null;
  vision!: string;
  mission!: string;
  values!: string;
  capabilities!: string;
  overviewImage?: MediaEntity;

  constructor(data: AboutPageZodType) {
    super();
    Object.assign(this, data);
  }
}
