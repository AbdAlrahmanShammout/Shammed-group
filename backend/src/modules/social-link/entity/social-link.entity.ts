import { BaseEntity } from '@/common/base/base.entity';
import { SocialLinkZodType } from '@/modules/social-link/zod/social-link.zod';

export class SocialLinkEntity extends BaseEntity {
  platform!: string;
  url!: string;
  isVisible!: boolean;
  displayOrder!: number;

  constructor(data: SocialLinkZodType) {
    super();
    Object.assign(this, data);
  }
}
