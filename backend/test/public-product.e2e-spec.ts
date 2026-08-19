import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Public product (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let visibleCategoryId: number;
  let otherCategoryId: number;
  let visibleId: number;
  let hiddenId: number;
  let otherVisibleId: number;

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
    const visibleCategory = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Visible product category', isVisible: true });
    const otherCategory = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Other product category', isVisible: true });
    visibleCategoryId = visibleCategory.body.productCategory.id;
    otherCategoryId = otherCategory.body.productCategory.id;
    const visible = await request(app.getHttpServer())
      .post('/admin/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Visible product',
        shortDescription: 'Shown publicly',
        categoryId: visibleCategoryId,
        isVisible: true,
      });
    const hidden = await request(app.getHttpServer())
      .post('/admin/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Hidden product',
        shortDescription: 'Hidden from public',
        categoryId: visibleCategoryId,
        isVisible: false,
      });
    const otherVisible = await request(app.getHttpServer())
      .post('/admin/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Other visible product',
        shortDescription: 'Another category',
        categoryId: otherCategoryId,
        isVisible: true,
      });
    visibleId = visible.body.product.id;
    hiddenId = hidden.body.product.id;
    otherVisibleId = otherVisible.body.product.id;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/admin/product/${visibleId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/product/${hiddenId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/product/${otherVisibleId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/product-category/${visibleCategoryId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/product-category/${otherCategoryId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await app.close();
  });

  it('lists only visible products', async () => {
    const actual = await request(app.getHttpServer()).get('/product');
    expect(actual.status).toBe(200);
    const names = actual.body.products.map((product: { name: string }) => product.name);
    expect(names).toContain('Visible product');
    expect(names).toContain('Other visible product');
    expect(names).not.toContain('Hidden product');
  });

  it('filters public products by category', async () => {
    const actual = await request(app.getHttpServer()).get(
      `/product?categoryId=${visibleCategoryId}`,
    );
    expect(actual.status).toBe(200);
    const names = actual.body.products.map((product: { name: string }) => product.name);
    expect(names).toContain('Visible product');
    expect(names).not.toContain('Other visible product');
    expect(names).not.toContain('Hidden product');
  });

  it('hides a disabled product by id', async () => {
    const actual = await request(app.getHttpServer()).get(`/product/${hiddenId}`);
    expect(actual.status).toBe(404);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'RESOURCE_NOT_FOUND',
        statusCode: 404,
      }),
    );
  });
});
