import { TransactionContext } from '@/common/base/transaction-context';
import { CreateMediaRepoInput } from '@/modules/media/defs/media-repository.defs';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export type MediaPage = {
  readonly entities: MediaEntity[];
  readonly total: number;
};

export abstract class MediaRepository {
  abstract create(input: CreateMediaRepoInput, context?: TransactionContext): Promise<MediaEntity>;
  abstract findById(id: number): Promise<MediaEntity | null>;
  abstract findAll(limit: number, offset: number): Promise<MediaPage>;
  abstract deleteById(id: number): Promise<void>;
  abstract findUnreferenced(): Promise<MediaEntity[]>;
}
