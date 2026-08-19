import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateLocationRepoInput,
  GetLocationsRepoInput,
  LocationPage,
  UpdateLocationRepoInput,
} from '@/modules/location/defs/location-repository.defs';
import { LocationEntity } from '@/modules/location/entity/location.entity';

export abstract class LocationRepository {
  abstract create(
    input: CreateLocationRepoInput,
    context?: TransactionContext,
  ): Promise<LocationEntity>;
  abstract findById(id: number): Promise<LocationEntity | null>;
  abstract findAll(input: GetLocationsRepoInput): Promise<LocationPage>;
  abstract update(
    input: UpdateLocationRepoInput,
    context?: TransactionContext,
  ): Promise<LocationEntity>;
  abstract delete(id: number, context?: TransactionContext): Promise<void>;
}
