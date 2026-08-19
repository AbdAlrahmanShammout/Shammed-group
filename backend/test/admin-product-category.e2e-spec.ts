import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

describe('Admin product category (e2e)', () => {
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
    await prismaProviderService.product.deleteMany();
    await prismaProviderService.productCategory.deleteMany();
    const inputPassword = app.get(AuthConfigService).adminPassword;
    const login = await request(app.getHttpServer())
      .post('/admin/auth/login')
      .send({ password: inputPassword });
    accessToken = login.body.accessToken;
  });

  afterAll(async () => {
    await prismaProviderService.product.deleteMany();
    await prismaProviderService.productCategory.deleteMany();
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/product-category');
    expect(actual.status).toBe(401);
  });

  it('deletes an empty product category', async () => {
    const created = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Empty category' });
    const id = created.body.productCategory.id as number;
    const actual = await request(app.getHttpServer())
      .delete(`/admin/product-category/${id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(actual.status).toBe(200);
    expect(actual.body).toEqual(
      expect.objectContaining({
        message: 'Product category deleted',
        status: 'ok',
      }),
    );
  });

  it('rejects deleting an occupied category without a replacement', async () => {
    const occupied = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Occupied without replacement' });
    const replacement = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Unused replacement' });
    await prismaProviderService.product.create({
      data: {
        name: 'Occupied product',
        shortDescription: 'Assigned to occupied category',
        categoryId: occupied.body.productCategory.id,
      },
    });
    const actual = await request(app.getHttpServer())
      .delete(`/admin/product-category/${occupied.body.productCategory.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(actual.status).toBe(400);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'PRODUCT_CATEGORY_OCCUPIED',
        statusCode: 400,
      }),
    );
    await prismaProviderService.product.deleteMany({
      where: { categoryId: occupied.body.productCategory.id },
    });
    await request(app.getHttpServer())
      .delete(`/admin/product-category/${occupied.body.productCategory.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/product-category/${replacement.body.productCategory.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
  });

  it('reassigns products and deletes an occupied category', async () => {
    const source = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Source category' });
    const target = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Target category' });
    const product = await prismaProviderService.product.create({
      data: {
        name: 'Reassigned product',
        shortDescription: 'Moves with category delete',
        categoryId: source.body.productCategory.id,
      },
    });
    const actual = await request(app.getHttpServer())
      .delete(
        `/admin/product-category/${source.body.productCategory.id}?replacementCategoryId=${target.body.productCategory.id}`,
      )
      .set('Authorization', `Bearer ${accessToken}`);
    expect(actual.status).toBe(200);
    const moved = await prismaProviderService.product.findUnique({ where: { id: product.id } });
    expect(moved?.categoryId).toBe(target.body.productCategory.id);
    await prismaProviderService.product.delete({ where: { id: product.id } });
    await request(app.getHttpServer())
      .delete(`/admin/product-category/${target.body.productCategory.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
  });

  it('rejects deleting the last occupied category', async () => {
    await prismaProviderService.product.deleteMany();
    await prismaProviderService.productCategory.deleteMany();
    const only = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Only category' });
    await prismaProviderService.product.create({
      data: {
        name: 'Only product',
        shortDescription: 'Assigned to the only category',
        categoryId: only.body.productCategory.id,
      },
    });
    const actual = await request(app.getHttpServer())
      .delete(`/admin/product-category/${only.body.productCategory.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(actual.status).toBe(400);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'PRODUCT_CATEGORY_LAST_OCCUPIED',
        statusCode: 400,
      }),
    );
  });
});
