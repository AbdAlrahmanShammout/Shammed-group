import { Module } from '@nestjs/common';

import { ImageProcessorService } from '@/providers/storage/image-processor.service';
import { StorageManagerService } from '@/providers/storage/storage-manager.service';

@Module({
  providers: [ImageProcessorService, StorageManagerService],
  exports: [ImageProcessorService, StorageManagerService],
})
export class StorageProviderModule {}
