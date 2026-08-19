import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Public social link (e2e)', () => {
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
      .post('/admin/social-link')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        platform: 'Visible platform',
        url: 'https://www.linkedin.com/company/visible',
        isVisible: true,
      });
    const hidden = await request(app.getHttpServer())
      .post('/admin/social-link')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        platform: 'Hidden platform',
        url: 'https://www.linkedin.com/company/hidden',
        isVisible: false,
      });
    visibleId = visible.body.socialLink.id;
    hiddenId = hidden.body.socialLink.id;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/admin/social-link/${visibleId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/social-link/${hiddenId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await app.close();
  });

  it('lists only enabled social links', async () => {
    const actual = await request(app.getHttpServer()).get('/social-link');
    expect(actual.status).toBe(200);
    const platforms = actual.body.socialLinks.map(
      (socialLink: { platform: string }) => socialLink.platform,
    );
    expect(platforms).toContain('Visible platform');
    expect(platforms).not.toContain('Hidden platform');
  });

  it('hides a disabled social link by id', async () => {
    const actual = await request(app.getHttpServer()).get(`/social-link/${hiddenId}`);
    expect(actual.status).toBe(404);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'RESOURCE_NOT_FOUND',
        statusCode: 404,
      }),
    );
  });
});
