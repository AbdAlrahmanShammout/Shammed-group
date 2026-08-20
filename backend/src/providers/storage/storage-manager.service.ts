import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { Injectable } from '@nestjs/common';

import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';
import { StorageConfigService } from '@/config/storage/storage-config.service';
import { ALLOWED_IMAGE_MIME_TYPES, AllowedImageMimeType } from '@/providers/storage/consts';
import { StoreFileInput, StoredFile } from '@/providers/storage/defs/storage-manager.defs';
import { StorageFileTooLargeException } from '@/providers/storage/exceptions/storage-file-too-large.exception';
import { StorageInvalidTypeException } from '@/providers/storage/exceptions/storage-invalid-type.exception';

@Injectable()
export class StorageManagerService {
  constructor(private readonly storageConfigService: StorageConfigService) {}

  async storeFile(input: StoreFileInput): Promise<StoredFile> {
    const mimeType = this.parseAllowedMimeType(input.mimeType, input.originalFileName);
    this.assertIsWithinSizeLimit(input.content.byteLength);
    const storedFileName = this.createStoredFileName(mimeType);
    await this.writeStoredFile(storedFileName, input.content);
    return {
      originalFileName: input.originalFileName,
      storedFileName,
      mimeType,
      byteSize: input.content.byteLength,
      storageKey: storedFileName,
    };
  }

  async readFile(storageKey: string): Promise<Buffer> {
    const destinationPath = path.join(this.storageConfigService.rootPath, storageKey);
    try {
      return await readFile(destinationPath);
    } catch (error) {
      if (this.isMissingFileError(error)) {
        throw new DependencyFailureException({
          message: 'Stored media file is missing',
          code: 'STORAGE_READ_MISSING',
          userFriendly: true,
        });
      }
      throw new DependencyFailureException({
        message: 'Failed to read the stored file',
        code: 'STORAGE_READ_FAILED',
        userFriendly: true,
      });
    }
  }

  async deleteFile(storageKey: string): Promise<void> {
    const destinationPath = path.join(this.storageConfigService.rootPath, storageKey);
    try {
      await unlink(destinationPath);
    } catch (error) {
      if (this.isMissingFileError(error)) {
        return;
      }
      throw new DependencyFailureException({
        message: 'Failed to delete the stored file',
        code: 'STORAGE_DELETE_FAILED',
        userFriendly: true,
      });
    }
  }

  private parseAllowedMimeType(mimeType: string, originalFileName: string): AllowedImageMimeType {
    if (!this.isAllowedImageMimeType(mimeType)) {
      throw new StorageInvalidTypeException();
    }
    const extension = path.extname(originalFileName).toLowerCase();
    const allowedExtensions: readonly string[] = ALLOWED_IMAGE_MIME_TYPES[mimeType];
    if (!allowedExtensions.includes(extension)) {
      throw new StorageInvalidTypeException();
    }
    return mimeType;
  }

  private isAllowedImageMimeType(mimeType: string): mimeType is AllowedImageMimeType {
    return mimeType in ALLOWED_IMAGE_MIME_TYPES;
  }

  private assertIsWithinSizeLimit(byteSize: number): void {
    if (byteSize > this.storageConfigService.maxFileBytes) {
      throw new StorageFileTooLargeException(this.storageConfigService.maxFileBytes);
    }
  }

  private createStoredFileName(mimeType: AllowedImageMimeType): string {
    return `${randomUUID()}${ALLOWED_IMAGE_MIME_TYPES[mimeType][0]}`;
  }

  private async writeStoredFile(storedFileName: string, content: Buffer): Promise<void> {
    const destinationPath = path.join(this.storageConfigService.rootPath, storedFileName);
    try {
      await mkdir(path.dirname(destinationPath), { recursive: true });
      await writeFile(destinationPath, content);
    } catch {
      throw new DependencyFailureException({
        message: 'Failed to store the uploaded file',
        code: 'STORAGE_WRITE_FAILED',
        userFriendly: true,
      });
    }
  }

  private isMissingFileError(error: unknown): boolean {
    return (
      typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
    );
  }
}
