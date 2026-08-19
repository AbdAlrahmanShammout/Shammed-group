import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Public partner (e2e)', () => {
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
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Visible Partner',
        shortDescription: 'Shown publicly',
        isVisible: true,
      });
    const hidden = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Hidden Partner',
        shortDescription: 'Hidden from public',
        isVisible: false,
      });
    visibleId = visible.body.partner.id;
    hiddenId = hidden.body.partner.id;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/admin/partner/${visibleId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/partner/${hiddenId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await app.close();
  });

  it('lists only visible partners', async () => {
    const actual = await request(app.getHttpServer()).get('/partner');
    expect(actual.status).toBe(200);
    const names = actual.body.partners.map((partner: { name: string }) => partner.name);
    expect(names).toContain('Visible Partner');
    expect(names).not.toContain('Hidden Partner');
  });

  it('hides a disabled partner by id', async () => {
    const actual = await request(app.getHttpServer()).get(`/partner/${hiddenId}`);
    expect(actual.status).toBe(404);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'RESOURCE_NOT_FOUND',
        statusCode: 404,
      }),
    );
  });
});
