import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Admin location (e2e)', () => {
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
        .delete(`/admin/location/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/location');
    expect(actual.status).toBe(401);
  });

  it('creates a location with coordinates and phones', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/location')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Damascus office',
        address: 'Mazzeh, Damascus',
        latitude: 33.5138,
        longitude: 36.2765,
        phones: [{ phone: '+963 11 123 4567' }],
      });
    expect(actual.status).toBe(201);
    expect(actual.body.location).toEqual(
      expect.objectContaining({
        name: 'Damascus office',
        latitude: 33.5138,
        longitude: 36.2765,
        isVisible: true,
        isMapVisible: true,
      }),
    );
    expect(actual.body.location.phones).toHaveLength(1);
    createdIds.push(actual.body.location.id);
  });

  it('rejects an invalid latitude', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/location')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Invalid coordinates',
        address: 'Somewhere',
        latitude: 100,
        longitude: 36.2765,
        phones: [{ phone: '+963 11 123 4567' }],
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
