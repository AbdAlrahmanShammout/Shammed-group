import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import { DEFAULT_SITE_SETTINGS_EMAIL } from '@/modules/site-settings/site-settings.constants';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('Admin site settings (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let prismaProviderService: PrismaProviderService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prismaProviderService = app.get(PrismaProviderService);
    await prismaProviderService.siteSettings.deleteMany();
    const inputPassword = app.get(AuthConfigService).adminPassword;
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: inputPassword });
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    await prismaProviderService.siteSettings.deleteMany();
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/site-settings');
    expect(actual.status).toBe(401);
  });

  it('creates the singleton site settings record', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/site-settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        companyName: 'Shammed Group',
        companyNameEnglish: 'Shammed Group',
        companyNameArabic: 'مجموعة شاميد',
        phone: '+963 11 000 0000',
      });
    expect(actual.status).toBe(201);
    expect(actual.body.siteSettings).toEqual(
      expect.objectContaining({
        companyName: 'Shammed Group',
        companyNameEnglish: 'Shammed Group',
        email: DEFAULT_SITE_SETTINGS_EMAIL,
        phone: '+963 11 000 0000',
      }),
    );
  });

  it('rejects a second settings record', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/site-settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        companyName: 'Other name',
        companyNameEnglish: 'Other name',
        phone: '+963 11 111 1111',
      });
    expect(actual.status).toBe(409);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'SITE_SETTINGS_ALREADY_EXISTS',
        statusCode: 409,
      }),
    );
  });

  it('rejects an invalid email on update', async () => {
    const actual = await request(app.getHttpServer())
      .patch('/admin/site-settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ email: 'not-an-email' });
    expect(actual.status).toBe(422);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'BAD_USER_INPUT',
        statusCode: 422,
      }),
    );
  });

  it('updates site settings', async () => {
    const actual = await request(app.getHttpServer())
      .patch('/admin/site-settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'contact@shammed-group.com',
        whatsApp: '+963 11 222 2222',
      });
    expect(actual.status).toBe(200);
    expect(actual.body.siteSettings).toEqual(
      expect.objectContaining({
        email: 'contact@shammed-group.com',
        whatsApp: '+963 11 222 2222',
      }),
    );
  });
});
