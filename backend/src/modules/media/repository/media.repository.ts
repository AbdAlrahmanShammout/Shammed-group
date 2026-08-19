import { TransactionContext } from '@/common/base/transaction-context';
import { CreateMediaRepoInput } from '@/modules/media/defs/media-repository.defs';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export abstract class MediaRepository {
  abstract create(input: CreateMediaRepoInput, context?: TransactionContext): Promise<MediaEntity>;
  abstract findById(id: number): Promise<MediaEntity | null>;
}
