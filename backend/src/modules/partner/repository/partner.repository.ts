import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreatePartnerRepoInput,
  GetPartnersRepoInput,
  PartnerPage,
  UpdatePartnerRepoInput,
} from '@/modules/partner/defs/partner-repository.defs';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';

export abstract class PartnerRepository {
  abstract create(
    input: CreatePartnerRepoInput,
    context?: TransactionContext,
  ): Promise<PartnerEntity>;
  abstract findById(id: number): Promise<PartnerEntity | null>;
  abstract findAll(input: GetPartnersRepoInput): Promise<PartnerPage>;
  abstract update(
    input: UpdatePartnerRepoInput,
    context?: TransactionContext,
  ): Promise<PartnerEntity>;
  abstract delete(id: number, context?: TransactionContext): Promise<void>;
}
