import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateServiceRepoInput,
  GetServicesRepoInput,
  ServicePage,
  UpdateServiceRepoInput,
} from '@/modules/service/defs/service-repository.defs';
import { ServiceEntity } from '@/modules/service/entity/service.entity';

export abstract class ServiceRepository {
  abstract create(
    input: CreateServiceRepoInput,
    context?: TransactionContext,
  ): Promise<ServiceEntity>;
  abstract findById(id: number): Promise<ServiceEntity | null>;
  abstract findAll(input: GetServicesRepoInput): Promise<ServicePage>;
  abstract update(
    input: UpdateServiceRepoInput,
    context?: TransactionContext,
  ): Promise<ServiceEntity>;
  abstract delete(id: number, context?: TransactionContext): Promise<void>;
}
