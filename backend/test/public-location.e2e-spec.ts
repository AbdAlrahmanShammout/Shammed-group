import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Public location (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let visibleId: number;
  let hiddenId: number;

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
    const visible = await request(app.getHttpServer())
      .post('/admin/location')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Visible branch',
        address: 'Aleppo',
        isVisible: true,
        phones: [{ phone: '+963 21 111 1111' }],
      });
    const hidden = await request(app.getHttpServer())
      .post('/admin/location')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Hidden branch',
        address: 'Homs',
        isVisible: false,
        phones: [{ phone: '+963 31 222 2222' }],
      });
    visibleId = visible.body.location.id;
    hiddenId = hidden.body.location.id;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/admin/location/${visibleId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/location/${hiddenId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await app.close();
  });

  it('lists only visible locations', async () => {
    const actual = await request(app.getHttpServer()).get('/location');
    expect(actual.status).toBe(200);
    const names = actual.body.locations.map((location: { name: string }) => location.name);
    expect(names).toContain('Visible branch');
    expect(names).not.toContain('Hidden branch');
  });

  it('returns a visible location by id', async () => {
    const actual = await request(app.getHttpServer()).get(`/location/${visibleId}`);
    expect(actual.status).toBe(200);
    expect(actual.body.location.name).toBe('Visible branch');
  });

  it('hides a hidden location by id', async () => {
    const actual = await request(app.getHttpServer()).get(`/location/${hiddenId}`);
    expect(actual.status).toBe(404);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'RESOURCE_NOT_FOUND',
        statusCode: 404,
      }),
    );
  });
});
