import { Module } from '@nestjs/common';

import { StorageManagerService } from '@/providers/storage/storage-manager.service';

@Module({
  providers: [StorageManagerService],
  exports: [StorageManagerService],
})
export class StorageProviderModule {}
