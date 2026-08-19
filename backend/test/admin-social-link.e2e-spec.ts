import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Admin social link (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  const createdIds: number[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    const inputPassword = app.get(AuthConfigService).adminPassword;
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: inputPassword });
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    for (const id of createdIds) {
      await request(app.getHttpServer())
        .delete(`/admin/social-link/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/social-link');
    expect(actual.status).toBe(401);
  });

  it('creates a social link', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/social-link')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/company/example',
      });
    expect(actual.status).toBe(201);
    expect(actual.body.socialLink).toEqual(
      expect.objectContaining({
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/company/example',
        isVisible: true,
      }),
    );
    createdIds.push(actual.body.socialLink.id);
  });

  it('rejects an invalid URL', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/social-link')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        platform: 'LinkedIn',
        url: 'not-a-url',
      });
    expect(actual.status).toBe(422);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'BAD_USER_INPUT',
        statusCode: 422,
      }),
    );
  });
});
