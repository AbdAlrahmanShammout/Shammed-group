import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Admin service (e2e)', () => {
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
        .delete(`/admin/service/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/service');
    expect(actual.status).toBe(401);
  });

  it('creates a service with a title outside the SRS suggestions', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Custom Logistics Support',
        description: 'Regional warehousing and last-mile delivery for licensed products.',
      });
    expect(actual.status).toBe(201);
    expect(actual.body.service).toEqual(
      expect.objectContaining({
        title: 'Custom Logistics Support',
        description: 'Regional warehousing and last-mile delivery for licensed products.',
        isVisible: true,
        displayOrder: 0,
      }),
    );
    createdIds.push(actual.body.service.id);
  });

  it('reorders services by displayOrder', async () => {
    const first = await request(app.getHttpServer())
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Reorder First',
        description: 'First service',
        displayOrder: 2,
      });
    const second = await request(app.getHttpServer())
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Reorder Second',
        description: 'Second service',
        displayOrder: 3,
      });
    createdIds.push(first.body.service.id, second.body.service.id);
    const reordered = await request(app.getHttpServer())
      .patch(`/admin/service/${first.body.service.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ displayOrder: 8 });
    expect(reordered.status).toBe(200);
    expect(reordered.body.service.displayOrder).toBe(8);
    const actual = await request(app.getHttpServer())
      .get('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`);
    const titles = actual.body.services.map((service: { title: string }) => service.title);
    expect(titles.indexOf('Reorder Second')).toBeLessThan(titles.indexOf('Reorder First'));
  });

  it('deletes a service', async () => {
    const created = await request(app.getHttpServer())
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Delete Me',
        description: 'Temporary service',
      });
    const id = created.body.service.id as number;
    const deleted = await request(app.getHttpServer())
      .delete(`/admin/service/${id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(deleted.status).toBe(200);
    expect(deleted.body).toEqual(
      expect.objectContaining({
        message: 'Service deleted',
        status: 'ok',
      }),
    );
    const actual = await request(app.getHttpServer())
      .get(`/admin/service/${id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(actual.status).toBe(404);
  });
});
