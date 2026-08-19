import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateHomePageRepoInput,
  UpdateHomePageRepoInput,
} from '@/modules/home-page/defs/home-page-repository.defs';
import { HomePageEntity } from '@/modules/home-page/entity/home-page.entity';

export abstract class HomePageRepository {
  abstract create(
    input: CreateHomePageRepoInput,
    context?: TransactionContext,
  ): Promise<HomePageEntity>;
  abstract findSingleton(): Promise<HomePageEntity | null>;
  abstract update(
    input: UpdateHomePageRepoInput,
    context?: TransactionContext,
  ): Promise<HomePageEntity>;
}
