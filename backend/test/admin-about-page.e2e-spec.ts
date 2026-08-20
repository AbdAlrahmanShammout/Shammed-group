import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

function buildCreateAboutPageBody(): Record<string, string> {
  return {
    overview: 'Shammed Group was established in 2005.',
    vision: 'To be a trusted regional healthcare partner.',
    mission: 'Provide reliable distribution and representation.',
    values: 'Quality, trust, professionalism, innovation, partnership, and commitment.',
    capabilities: 'Distribution, international representation, and a regional sales network.',
  };
}

describe('Admin about page (e2e)', () => {
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
    await prismaProviderService.aboutPage.deleteMany();
    const inputPassword = app.get(AuthConfigService).adminPassword;
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: inputPassword });
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    await prismaProviderService.aboutPage.deleteMany();
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/about-page');
    expect(actual.status).toBe(401);
  });

  it('creates the singleton about page with free-form values text', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/about-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(buildCreateAboutPageBody());
    expect(actual.status).toBe(201);
    expect(actual.body.aboutPage).toEqual(
      expect.objectContaining({
        overview: 'Shammed Group was established in 2005.',
        vision: 'To be a trusted regional healthcare partner.',
        mission: 'Provide reliable distribution and representation.',
        values: 'Quality, trust, professionalism, innovation, partnership, and commitment.',
        capabilities: 'Distribution, international representation, and a regional sales network.',
      }),
    );
    expect(typeof actual.body.aboutPage.values).toBe('string');
    expect(Array.isArray(actual.body.aboutPage.values)).toBe(false);
  });

  it('rejects a second about page record', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/about-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(buildCreateAboutPageBody());
    expect(actual.status).toBe(409);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'ABOUT_PAGE_ALREADY_EXISTS',
        statusCode: 409,
      }),
    );
  });

  it('updates about page CMS fields', async () => {
    const actual = await request(app.getHttpServer())
      .patch('/admin/about-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ vision: 'Updated vision for regional healthcare partnership.' });
    expect(actual.status).toBe(200);
    expect(actual.body.aboutPage.vision).toBe(
      'Updated vision for regional healthcare partnership.',
    );
  });
});
