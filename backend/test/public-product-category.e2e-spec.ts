import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('Public product category (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let prismaProviderService: PrismaProviderService;
  let hiddenId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new InputValidationPipe());
    await app.init();
    prismaProviderService = app.get(PrismaProviderService);
    await prismaProviderService.product.deleteMany();
    await prismaProviderService.productCategory.deleteMany();
    const inputPassword = app.get(AuthConfigService).adminPassword;
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: inputPassword });
    accessToken = login.body.accessToken;
    await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Visible category',
        isVisible: true,
      });
    const hidden = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Hidden category',
        isVisible: false,
      });
    hiddenId = hidden.body.productCategory.id;
  });

  afterAll(async () => {
    await prismaProviderService.product.deleteMany();
    await prismaProviderService.productCategory.deleteMany();
    await app.close();
  });

  it('lists only visible product categories', async () => {
    const actual = await request(app.getHttpServer()).get('/product-category');
    expect(actual.status).toBe(200);
    const names = actual.body.productCategories.map(
      (productCategory: { name: string }) => productCategory.name,
    );
    expect(names).toContain('Visible category');
    expect(names).not.toContain('Hidden category');
  });

  it('hides a disabled product category by id', async () => {
    const actual = await request(app.getHttpServer()).get(`/product-category/${hiddenId}`);
    expect(actual.status).toBe(404);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'RESOURCE_NOT_FOUND',
        statusCode: 404,
      }),
    );
  });
});
