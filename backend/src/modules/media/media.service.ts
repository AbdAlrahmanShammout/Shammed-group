import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import type {
  CreateMediaServiceInput,
  MediaFileContent,
} from '@/modules/media/defs/media-service.defs';
import { MediaEntity } from '@/modules/media/entity/media.entity';
import { MediaRepository } from '@/modules/media/repository/media.repository';
import { StorageManagerService } from '@/providers/storage/storage-manager.service';

@Injectable()
export class MediaService {
  constructor(
    private readonly mediaRepository: MediaRepository,
    private readonly storageManagerService: StorageManagerService,
  ) {}

  async createMedia(input: CreateMediaServiceInput): Promise<MediaEntity> {
    const storedFile = await this.storageManagerService.storeFile({
      originalFileName: input.originalFileName,
      mimeType: input.mimeType,
      content: input.content,
    });
    try {
      return await this.mediaRepository.create({
        originalFileName: storedFile.originalFileName,
        storedFileName: storedFile.storedFileName,
        mimeType: storedFile.mimeType,
        byteSize: storedFile.byteSize,
        storageKey: storedFile.storageKey,
      });
    } catch (error) {
      await this.deleteStoredFileBestEffort(storedFile.storageKey);
      throw error;
    }
  }

  async findMediaById(id: number): Promise<MediaEntity | null> {
    return this.mediaRepository.findById(id);
  }

  async getMediaById(id: number): Promise<MediaEntity> {
    const media = await this.findMediaById(id);
    if (!media) {
      throw new ResourceNotFoundException('Media', id);
    }
    return media;
  }

  async getMediaFileContent(id: number): Promise<MediaFileContent> {
    const media = await this.getMediaById(id);
    const content = await this.storageManagerService.readFile(media.storageKey);
    return {
      originalFileName: media.originalFileName,
      mimeType: media.mimeType,
      content,
    };
  }

  async deleteMedia(id: number): Promise<void> {
    const media = await this.getMediaById(id);
    await this.mediaRepository.deleteById(id);
    await this.deleteStoredFileBestEffort(media.storageKey);
  }

  async deleteUnreferencedMedia(): Promise<{ readonly deletedCount: number }> {
    const unreferenced = await this.mediaRepository.findUnreferenced();
    for (const media of unreferenced) {
      await this.mediaRepository.deleteById(media.id);
      await this.deleteStoredFileBestEffort(media.storageKey);
    }
    return { deletedCount: unreferenced.length };
  }

  private async deleteStoredFileBestEffort(storageKey: string): Promise<void> {
    try {
      await this.storageManagerService.deleteFile(storageKey);
    } catch {
      return;
    }
  }
}
