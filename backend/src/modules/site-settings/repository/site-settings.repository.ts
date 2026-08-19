import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateSiteSettingsRepoInput,
  UpdateSiteSettingsRepoInput,
} from '@/modules/site-settings/defs/site-settings-repository.defs';
import { SiteSettingsEntity } from '@/modules/site-settings/entity/site-settings.entity';

export abstract class SiteSettingsRepository {
  abstract create(
    input: CreateSiteSettingsRepoInput,
    context?: TransactionContext,
  ): Promise<SiteSettingsEntity>;
  abstract findSingleton(): Promise<SiteSettingsEntity | null>;
  abstract update(
    input: UpdateSiteSettingsRepoInput,
    context?: TransactionContext,
  ): Promise<SiteSettingsEntity>;
}
