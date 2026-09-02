import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

function buildCreateHomePageBody(): Record<string, string> {
  return {
    heroTitle: 'Shammed Group',
    heroDescription: 'Pharmaceutical and medical product distribution since 2005.',
    primaryCtaText: 'Learn More',
    primaryCtaUrl: '/about',
    secondaryCtaText: 'Contact Us',
    secondaryCtaUrl: '/contact',
    aboutPreviewTitle: 'About Us',
    aboutPreviewDescription: 'Founded in 2005.',
    aboutPreviewCtaText: 'Read more',
    aboutPreviewCtaUrl: '/about',
    partnersSectionTitle: 'Our Partners',
    productsSectionTitle: 'Our Products',
    servicesSectionTitle: 'Our Services',
    whyTitle: 'Why Shammed Group',
    whyDescription: 'Experience and international partnerships.',
    heroEyebrow: 'FORMULATION / 01 — SYRIA',
    heroExperienceLabel: '+20 years of advancing healthcare in Syria',
    contactSectionTitle: 'Contact Us',
  };
}

describe('Admin home page (e2e)', () => {
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
    await prismaProviderService.homePage.deleteMany();
    const inputPassword = app.get(AuthConfigService).adminPassword;
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: inputPassword });
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    await prismaProviderService.homePage.deleteMany();
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/home-page');
    expect(actual.status).toBe(401);
  });

  it('creates the singleton home page record', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/home-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(buildCreateHomePageBody());
    expect(actual.status).toBe(201);
    expect(actual.body.homePage).toEqual(
      expect.objectContaining({
        heroTitle: 'Shammed Group',
        partnersSectionTitle: 'Our Partners',
        productsSectionTitle: 'Our Products',
        servicesSectionTitle: 'Our Services',
      }),
    );
    expect(actual.body.partners).toBeUndefined();
    expect(actual.body.products).toBeUndefined();
    expect(actual.body.services).toBeUndefined();
  });

  it('rejects a second home page record', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/home-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(buildCreateHomePageBody());
    expect(actual.status).toBe(409);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'HOME_PAGE_ALREADY_EXISTS',
        statusCode: 409,
      }),
    );
  });

  it('updates home page CMS fields', async () => {
    const actual = await request(app.getHttpServer())
      .patch('/admin/home-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ heroTitle: 'Updated Home Title' });
    expect(actual.status).toBe(200);
    expect(actual.body.homePage.heroTitle).toBe('Updated Home Title');
  });
});
