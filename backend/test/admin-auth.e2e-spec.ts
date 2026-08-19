import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { ADMIN_PRINCIPAL_ID } from '@/authentication/consts';
import { Role } from '@/authentication/enum/role.enum';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Admin auth (e2e)', () => {
  let app: INestApplication;
  let inputPassword: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    inputPassword = app.get(AuthConfigService).adminPassword;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects login with the wrong password', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: `${inputPassword}-mismatch` });
    expect(actual.status).toBe(401);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'UNAUTHENTICATED',
        statusCode: 401,
      }),
    );
  });

  it('returns a JWT when the configured password matches', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: inputPassword });
    expect(actual.status).toBe(200);
    expect(actual.body.accessToken).toEqual(expect.any(String));
  });

  it('rejects unauthenticated access to the admin session route', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/auth/me');
    expect(actual.status).toBe(401);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'UNAUTHENTICATED',
        statusCode: 401,
      }),
    );
  });

  it('returns the synthetic admin principal with a valid token', async () => {
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: inputPassword });
    const actual = await request(app.getHttpServer())
      .get('/admin/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`);
    expect(actual.status).toBe(200);
    expect(actual.body).toEqual({
      id: ADMIN_PRINCIPAL_ID,
      role: Role.ADMIN,
    });
  });

  it('keeps public health open without a token', async () => {
    const actual = await request(app.getHttpServer()).get('/health/live');
    expect(actual.status).toBe(200);
    expect(actual.body).toEqual({ status: 'ok' });
  });
});
