import { BaseEntity } from '@/common/base/base.entity';
import { MediaEntity } from '@/modules/media/entity/media.entity';
import { PartnerZodType } from '@/modules/partner/zod/partner.zod';

export class PartnerEntity extends BaseEntity {
  name!: string;
  shortDescription!: string;
  fullDescription!: string | null;
  specialization!: string | null;
  websiteUrl!: string | null;
  country!: string | null;
  isVisible!: boolean;
  displayOrder!: number;
  logoMediaId!: number | null;
  logo?: MediaEntity;

  constructor(data: PartnerZodType) {
    super();
    Object.assign(this, data);
  }
}
