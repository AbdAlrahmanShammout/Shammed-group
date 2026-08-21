import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { StorageConfigService } from '@/config/storage/storage-config.service';
import { StorageFileTooLargeException } from '@/providers/storage/exceptions/storage-file-too-large.exception';
import { StorageInvalidTypeException } from '@/providers/storage/exceptions/storage-invalid-type.exception';
import { ImageProcessorService } from '@/providers/storage/image-processor.service';
import { StorageManagerService } from '@/providers/storage/storage-manager.service';

function buildMockImageProcessor(outputBuffer?: Buffer): ImageProcessorService {
  return {
    processUpload: jest.fn(async (buf: Buffer) => ({
      buffer: outputBuffer ?? buf,
      mimeType: 'image/webp' as const,
    })),
    resizeToWidth: jest.fn(async (buf: Buffer) => buf),
  } as unknown as ImageProcessorService;
}

describe('StorageManagerService', () => {
  const inputMaxFileBytes = 5 * 1024 * 1024;
  let rootPath: string;
  let storageManagerService: StorageManagerService;
  let mockImageProcessor: ImageProcessorService;

  beforeEach(async () => {
    rootPath = await mkdtemp(path.join(os.tmpdir(), 'shammed-storage-'));
    const storageConfigService = {
      rootPath,
      maxFileBytes: inputMaxFileBytes,
    } as StorageConfigService;
    mockImageProcessor = buildMockImageProcessor();
    storageManagerService = new StorageManagerService(storageConfigService, mockImageProcessor);
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

  it('stores a PNG as WebP after processing', async () => {
    const inputContent = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const mockWebpOutput = Buffer.from('mock-webp-output');
    mockImageProcessor = buildMockImageProcessor(mockWebpOutput);
    storageManagerService = new StorageManagerService(
      { rootPath, maxFileBytes: inputMaxFileBytes } as StorageConfigService,
      mockImageProcessor,
    );

    const actual = await storageManagerService.storeFile({
      originalFileName: 'logo.png',
      mimeType: 'image/png',
      content: inputContent,
    });

    const storedContent = await readFile(path.join(rootPath, actual.storageKey));
    expect(actual.mimeType).toBe('image/webp');
    expect(actual.byteSize).toBe(mockWebpOutput.byteLength);
    expect(actual.storedFileName.endsWith('.webp')).toBe(true);
    expect(storedContent.equals(mockWebpOutput)).toBe(true);
  });

  it('deletes a stored file by storage key', async () => {
    const storedFile = await storageManagerService.storeFile({
      originalFileName: 'logo.png',
      mimeType: 'image/png',
      content: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    });
    await storageManagerService.deleteFile(storedFile.storageKey);
    await expect(readFile(path.join(rootPath, storedFile.storageKey))).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('ignores deletion of a missing file', async () => {
    await expect(storageManagerService.deleteFile('missing.webp')).resolves.toBeUndefined();
  });

  it('reads a stored file by storage key', async () => {
    const inputContent = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
    const storedFile = await storageManagerService.storeFile({
      originalFileName: 'logo.png',
      mimeType: 'image/png',
      content: inputContent,
    });
    const actual = await storageManagerService.readFile(storedFile.storageKey);
    expect(actual).toEqual(inputContent);
  });
});
