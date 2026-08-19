import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { StorageConfigService } from '@/config/storage/storage-config.service';
import { StorageFileTooLargeException } from '@/providers/storage/exceptions/storage-file-too-large.exception';
import { StorageInvalidTypeException } from '@/providers/storage/exceptions/storage-invalid-type.exception';
import { StorageManagerService } from '@/providers/storage/storage-manager.service';

describe('StorageManagerService', () => {
  const inputMaxFileBytes = 5 * 1024 * 1024;
  let rootPath: string;
  let storageManagerService: StorageManagerService;

  beforeEach(async () => {
    rootPath = await mkdtemp(path.join(os.tmpdir(), 'shammed-storage-'));
    const storageConfigService = {
      rootPath,
      maxFileBytes: inputMaxFileBytes,
    } as StorageConfigService;
    storageManagerService = new StorageManagerService(storageConfigService);
  });

  afterEach(async () => {
    await rm(rootPath, { recursive: true, force: true });
  });

  it('rejects a non-image MIME type', async () => {
    const input = {
      originalFileName: 'notes.txt',
      mimeType: 'text/plain',
      content: Buffer.from('hello'),
    };
    await expect(storageManagerService.storeFile(input)).rejects.toBeInstanceOf(
      StorageInvalidTypeException,
    );
  });

  it('rejects a GIF image', async () => {
    const input = {
      originalFileName: 'animation.gif',
      mimeType: 'image/gif',
      content: Buffer.from('gif'),
    };
    await expect(storageManagerService.storeFile(input)).rejects.toBeInstanceOf(
      StorageInvalidTypeException,
    );
  });

  it('rejects a JPEG whose extension does not match its MIME type', async () => {
    const input = {
      originalFileName: 'photo.png',
      mimeType: 'image/jpeg',
      content: Buffer.from('jpeg'),
    };
    await expect(storageManagerService.storeFile(input)).rejects.toBeInstanceOf(
      StorageInvalidTypeException,
    );
  });

  it('rejects a file larger than 5 MB', async () => {
    const input = {
      originalFileName: 'hero.png',
      mimeType: 'image/png',
      content: Buffer.alloc(inputMaxFileBytes + 1),
    };
    await expect(storageManagerService.storeFile(input)).rejects.toBeInstanceOf(
      StorageFileTooLargeException,
    );
  });

  it('stores a PNG within the size limit', async () => {
    const inputContent = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const actual = await storageManagerService.storeFile({
      originalFileName: 'logo.png',
      mimeType: 'image/png',
      content: inputContent,
    });
    const storedContent = await readFile(path.join(rootPath, actual.storageKey));
    expect(actual.mimeType).toBe('image/png');
    expect(actual.byteSize).toBe(inputContent.byteLength);
    expect(actual.storedFileName.endsWith('.png')).toBe(true);
    expect(storedContent.equals(inputContent)).toBe(true);
  });
});
