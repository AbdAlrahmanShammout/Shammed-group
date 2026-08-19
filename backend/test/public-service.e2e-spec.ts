import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Public service (e2e)', () => {
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
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Visible Service',
        description: 'Shown publicly',
        isVisible: true,
      });
    const hidden = await request(app.getHttpServer())
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Hidden Service',
        description: 'Hidden from public',
        isVisible: false,
      });
    visibleId = visible.body.service.id;
    hiddenId = hidden.body.service.id;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/admin/service/${visibleId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/service/${hiddenId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await app.close();
  });

  it('lists only visible services', async () => {
    const actual = await request(app.getHttpServer()).get('/service');
    expect(actual.status).toBe(200);
    const titles = actual.body.services.map((service: { title: string }) => service.title);
    expect(titles).toContain('Visible Service');
    expect(titles).not.toContain('Hidden Service');
  });

  it('hides a disabled service by id', async () => {
    const actual = await request(app.getHttpServer()).get(`/service/${hiddenId}`);
    expect(actual.status).toBe(404);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'RESOURCE_NOT_FOUND',
        statusCode: 404,
      }),
    );
  });
});
