import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import { DEFAULT_SITE_SETTINGS_EMAIL } from '@/modules/site-settings/site-settings.constants';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('Public site settings (e2e)', () => {
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
    await request(app.getHttpServer())
      .post('/admin/site-settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        companyName: 'Shammed Group',
        companyNameEnglish: 'Shammed Group',
        phone: '+963 11 000 0000',
      });
  });

  afterAll(async () => {
    await prismaProviderService.siteSettings.deleteMany();
    await app.close();
  });

  it('returns the public site settings record', async () => {
    const actual = await request(app.getHttpServer()).get('/site-settings');
    expect(actual.status).toBe(200);
    expect(actual.body.siteSettings).toEqual(
      expect.objectContaining({
        companyName: 'Shammed Group',
        companyNameEnglish: 'Shammed Group',
        email: DEFAULT_SITE_SETTINGS_EMAIL,
        phone: '+963 11 000 0000',
        phones: [
          expect.objectContaining({
            label: 'Primary',
            phone: '+963 11 000 0000',
            displayOrder: 0,
          }),
        ],
        emails: [
          expect.objectContaining({
            label: 'Primary',
            email: DEFAULT_SITE_SETTINGS_EMAIL,
            displayOrder: 0,
          }),
        ],
      }),
    );
  });
});
