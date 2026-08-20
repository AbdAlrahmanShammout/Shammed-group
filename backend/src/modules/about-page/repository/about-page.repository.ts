import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateAboutPageRepoInput,
  UpdateAboutPageRepoInput,
} from '@/modules/about-page/defs/about-page-repository.defs';
import { AboutPageEntity } from '@/modules/about-page/entity/about-page.entity';

export abstract class AboutPageRepository {
  abstract create(
    input: CreateAboutPageRepoInput,
    context?: TransactionContext,
  ): Promise<AboutPageEntity>;
  abstract findSingleton(): Promise<AboutPageEntity | null>;
  abstract update(
    input: UpdateAboutPageRepoInput,
    context?: TransactionContext,
  ): Promise<AboutPageEntity>;
}
