import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateSocialLinkRepoInput,
  GetSocialLinksRepoInput,
  SocialLinkPage,
  UpdateSocialLinkRepoInput,
} from '@/modules/social-link/defs/social-link-repository.defs';
import { SocialLinkEntity } from '@/modules/social-link/entity/social-link.entity';

export abstract class SocialLinkRepository {
  abstract create(
    input: CreateSocialLinkRepoInput,
    context?: TransactionContext,
  ): Promise<SocialLinkEntity>;
  abstract findById(id: number): Promise<SocialLinkEntity | null>;
  abstract findAll(input: GetSocialLinksRepoInput): Promise<SocialLinkPage>;
  abstract update(
    input: UpdateSocialLinkRepoInput,
    context?: TransactionContext,
  ): Promise<SocialLinkEntity>;
  abstract delete(id: number, context?: TransactionContext): Promise<void>;
}
