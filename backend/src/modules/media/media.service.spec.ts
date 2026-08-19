import { Test, TestingModule } from '@nestjs/testing';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaEntity } from '@/modules/media/entity/media.entity';
import { MediaService } from '@/modules/media/media.service';
import { MediaRepository } from '@/modules/media/repository/media.repository';
import { StorageFileTooLargeException } from '@/providers/storage/exceptions/storage-file-too-large.exception';
import { StorageInvalidTypeException } from '@/providers/storage/exceptions/storage-invalid-type.exception';
import { StorageManagerService } from '@/providers/storage/storage-manager.service';

describe('MediaService', () => {
  const inputContent = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
  const inputStoredFile = {
    originalFileName: 'logo.png',
    storedFileName: 'stored.png',
    mimeType: 'image/png',
    byteSize: inputContent.byteLength,
    storageKey: 'stored.png',
  };
  const expectedMedia = new MediaEntity({
    id: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    originalFileName: inputStoredFile.originalFileName,
    storedFileName: inputStoredFile.storedFileName,
    mimeType: inputStoredFile.mimeType,
    byteSize: inputStoredFile.byteSize,
    storageKey: inputStoredFile.storageKey,
  });
  let mediaService: MediaService;
  let mediaRepository: { create: jest.Mock; findById: jest.Mock };
  let storageManagerService: { storeFile: jest.Mock; deleteFile: jest.Mock };

  beforeEach(async () => {
    mediaRepository = {
      create: jest.fn().mockResolvedValue(expectedMedia),
      findById: jest.fn().mockResolvedValue(expectedMedia),
    };
    storageManagerService = {
      storeFile: jest.fn().mockResolvedValue(inputStoredFile),
      deleteFile: jest.fn().mockResolvedValue(undefined),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: MediaRepository, useValue: mediaRepository },
        { provide: StorageManagerService, useValue: storageManagerService },
      ],
    }).compile();
    mediaService = module.get(MediaService);
  });

  it('stores the file and persists a media row', async () => {
    const actual = await mediaService.createMedia({
      originalFileName: 'logo.png',
      mimeType: 'image/png',
      content: inputContent,
    });
    expect(actual).toBe(expectedMedia);
    expect(storageManagerService.storeFile).toHaveBeenCalledWith({
      originalFileName: 'logo.png',
      mimeType: 'image/png',
      content: inputContent,
    });
    expect(mediaRepository.create).toHaveBeenCalledWith(inputStoredFile);
    expect(storageManagerService.deleteFile).not.toHaveBeenCalled();
  });

  it('rejects an invalid image type from storage', async () => {
    storageManagerService.storeFile.mockRejectedValue(new StorageInvalidTypeException());
    await expect(
      mediaService.createMedia({
        originalFileName: 'notes.txt',
        mimeType: 'text/plain',
        content: Buffer.from('hello'),
      }),
    ).rejects.toBeInstanceOf(StorageInvalidTypeException);
    expect(mediaRepository.create).not.toHaveBeenCalled();
  });

  it('rejects a file that exceeds the size limit', async () => {
    storageManagerService.storeFile.mockRejectedValue(new StorageFileTooLargeException(5));
    await expect(
      mediaService.createMedia({
        originalFileName: 'hero.png',
        mimeType: 'image/png',
        content: inputContent,
      }),
    ).rejects.toBeInstanceOf(StorageFileTooLargeException);
    expect(mediaRepository.create).not.toHaveBeenCalled();
  });

  it('deletes the stored file when persistence fails', async () => {
    mediaRepository.create.mockRejectedValue(new Error('insert failed'));
    await expect(
      mediaService.createMedia({
        originalFileName: 'logo.png',
        mimeType: 'image/png',
        content: inputContent,
      }),
    ).rejects.toThrow('insert failed');
    expect(storageManagerService.deleteFile).toHaveBeenCalledWith(inputStoredFile.storageKey);
  });

  it('returns a media entity by id', async () => {
    const actual = await mediaService.getMediaById(1);
    expect(actual).toBe(expectedMedia);
  });

  it('throws ResourceNotFoundException when the media row is missing', async () => {
    mediaRepository.findById.mockResolvedValue(null);
    await expect(mediaService.getMediaById(99)).rejects.toBeInstanceOf(ResourceNotFoundException);
  });
});
