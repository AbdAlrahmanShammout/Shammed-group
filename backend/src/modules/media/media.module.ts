import { Module } from '@nestjs/common';

import { MediaService } from '@/modules/media/media.service';
import { MediaPrismaRepository } from '@/modules/media/repository/media-prisma.repository';
import { MediaRepository } from '@/modules/media/repository/media.repository';
import { DatabaseProviderModule } from '@/providers/database/database-provider.module';
import { StorageProviderModule } from '@/providers/storage/storage-provider.module';

@Module({
  imports: [DatabaseProviderModule, StorageProviderModule],
  providers: [MediaService, { provide: MediaRepository, useClass: MediaPrismaRepository }],
  exports: [MediaService],
})
export class MediaModule {}
