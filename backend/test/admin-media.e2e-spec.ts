import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import { StorageConfigService } from '@/config/storage/storage-config.service';

describe('Admin media (e2e)', () => {
  const inputPng = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
  let app: INestApplication;
  let accessToken: string;
  let maxFileBytes: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    const inputPassword = app.get(AuthConfigService).adminPassword;
    maxFileBytes = app.get(StorageConfigService).maxFileBytes;
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: inputPassword });
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects unauthenticated uploads', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/media')
      .attach('file', inputPng, { filename: 'logo.png', contentType: 'image/png' });
    expect(actual.status).toBe(401);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'UNAUTHENTICATED',
        statusCode: 401,
      }),
    );
  });

  it('uploads a valid PNG and returns a media DTO without storage paths', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/media')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', inputPng, { filename: 'logo.png', contentType: 'image/png' });
    expect(actual.status).toBe(201);
    expect(actual.body.media).toEqual(
      expect.objectContaining({
        originalFileName: 'logo.png',
        mimeType: 'image/png',
        byteSize: inputPng.byteLength,
      }),
    );
    expect(actual.body.media.id).toEqual(expect.any(Number));
    expect(actual.body.media.storageKey).toBeUndefined();
    expect(actual.body.media.storedFileName).toBeUndefined();
    expect(JSON.stringify(actual.body)).not.toMatch(/storage\//);
  });

  it('rejects a non-image file', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/media')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from('hello'), { filename: 'notes.txt', contentType: 'text/plain' });
    expect(actual.status).toBe(422);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'STORAGE_INVALID_TYPE',
        statusCode: 422,
      }),
    );
  });

  it('rejects a file larger than 5 MB', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/media')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.alloc(maxFileBytes + 1), {
        filename: 'hero.png',
        contentType: 'image/png',
      });
    expect(actual.status).toBe(422);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'STORAGE_FILE_TOO_LARGE',
        statusCode: 422,
      }),
    );
  });
});
