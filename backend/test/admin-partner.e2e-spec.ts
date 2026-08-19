import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Admin partner (e2e)', () => {
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
        .delete(`/admin/partner/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/partner');
    expect(actual.status).toBe(401);
  });

  it('creates a partner', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Example Pharma',
        shortDescription: 'International pharmaceutical manufacturer',
        websiteUrl: 'https://www.example-pharma.com',
      });
    expect(actual.status).toBe(201);
    expect(actual.body.partner).toEqual(
      expect.objectContaining({
        name: 'Example Pharma',
        shortDescription: 'International pharmaceutical manufacturer',
        isVisible: true,
        displayOrder: 0,
      }),
    );
    createdIds.push(actual.body.partner.id);
  });

  it('rejects an invalid website URL', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Example Pharma',
        shortDescription: 'International pharmaceutical manufacturer',
        websiteUrl: 'not-a-url',
      });
    expect(actual.status).toBe(422);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'BAD_USER_INPUT',
        statusCode: 422,
      }),
    );
  });

  it('reorders partners by displayOrder', async () => {
    const first = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Reorder First',
        shortDescription: 'First partner',
        displayOrder: 2,
      });
    const second = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Reorder Second',
        shortDescription: 'Second partner',
        displayOrder: 3,
      });
    createdIds.push(first.body.partner.id, second.body.partner.id);
    const reordered = await request(app.getHttpServer())
      .patch(`/admin/partner/${first.body.partner.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ displayOrder: 8 });
    expect(reordered.status).toBe(200);
    expect(reordered.body.partner.displayOrder).toBe(8);
    const actual = await request(app.getHttpServer())
      .get('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`);
    const names = actual.body.partners.map((partner: { name: string }) => partner.name);
    expect(names.indexOf('Reorder Second')).toBeLessThan(names.indexOf('Reorder First'));
  });

  it('deletes a partner', async () => {
    const created = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Delete Me',
        shortDescription: 'Temporary partner',
      });
    const id = created.body.partner.id as number;
    const deleted = await request(app.getHttpServer())
      .delete(`/admin/partner/${id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(deleted.status).toBe(200);
    expect(deleted.body).toEqual(
      expect.objectContaining({
        message: 'Partner deleted',
        status: 'ok',
      }),
    );
    const actual = await request(app.getHttpServer())
      .get(`/admin/partner/${id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(actual.status).toBe(404);
  });
});
