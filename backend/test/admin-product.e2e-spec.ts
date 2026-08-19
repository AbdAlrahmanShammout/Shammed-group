import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Admin product (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let categoryId: number;
  let partnerId: number;
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
    const category = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Admin product category' });
    const partner = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Admin product partner',
        shortDescription: 'Partner used in product tests',
      });
    categoryId = category.body.productCategory.id;
    partnerId = partner.body.partner.id;
  });

  afterAll(async () => {
    for (const id of createdIds) {
      await request(app.getHttpServer())
        .delete(`/admin/product/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    await request(app.getHttpServer())
      .delete(`/admin/partner/${partnerId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/product-category/${categoryId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/product');
    expect(actual.status).toBe(401);
  });

  it('creates a product with an optional partner', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Amoxicillin 500 mg',
        shortDescription: 'Broad-spectrum antibiotic capsules',
        categoryId,
        partnerId,
      });
    expect(actual.status).toBe(201);
    expect(actual.body.product).toEqual(
      expect.objectContaining({
        name: 'Amoxicillin 500 mg',
        categoryId,
        partnerId,
        isVisible: true,
      }),
    );
    expect(actual.body.product.category).toEqual(
      expect.objectContaining({
        id: categoryId,
        name: 'Admin product category',
      }),
    );
    expect(actual.body.product.partner).toEqual(
      expect.objectContaining({
        id: partnerId,
        name: 'Admin product partner',
      }),
    );
    createdIds.push(actual.body.product.id);
  });

  it('rejects a missing category', async () => {
    const actual = await request(app.getHttpServer())
      .post('/admin/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Missing category product',
        shortDescription: 'Should fail',
        categoryId: 999999,
      });
    expect(actual.status).toBe(404);
    expect(actual.body).toEqual(
      expect.objectContaining({
        code: 'RESOURCE_NOT_FOUND',
        statusCode: 404,
      }),
    );
  });
});
