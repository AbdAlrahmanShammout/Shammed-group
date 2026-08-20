import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AuthConfigService } from '@/config/auth/auth-config.service';

describe('Admin dashboard (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  const createdCategoryIds: number[] = [];
  const createdProductIds: number[] = [];
  const createdPartnerIds: number[] = [];
  const createdServiceIds: number[] = [];

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
  });

  afterAll(async () => {
    for (const id of createdProductIds) {
      await request(app.getHttpServer())
        .delete(`/admin/product/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    for (const id of createdCategoryIds) {
      await request(app.getHttpServer())
        .delete(`/admin/product-category/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    for (const id of createdPartnerIds) {
      await request(app.getHttpServer())
        .delete(`/admin/partner/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    for (const id of createdServiceIds) {
      await request(app.getHttpServer())
        .delete(`/admin/service/${id}`)
        .set('Authorization', `Bearer ${accessToken}`);
    }
    await app.close();
  });

  it('rejects unauthenticated admin access', async () => {
    const actual = await request(app.getHttpServer()).get('/admin/dashboard');
    expect(actual.status).toBe(401);
  });

  it('returns catalog counts that match newly created rows', async () => {
    const before = await request(app.getHttpServer())
      .get('/admin/dashboard')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(before.status).toBe(200);
    const visibleCategory = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Dashboard visible category', isVisible: true });
    const hiddenCategory = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Dashboard hidden category', isVisible: false });
    createdCategoryIds.push(
      visibleCategory.body.productCategory.id,
      hiddenCategory.body.productCategory.id,
    );
    const visibleProduct = await request(app.getHttpServer())
      .post('/admin/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Dashboard visible product',
        shortDescription: 'Counted as visible',
        categoryId: visibleCategory.body.productCategory.id,
        isVisible: true,
      });
    const hiddenProduct = await request(app.getHttpServer())
      .post('/admin/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Dashboard hidden product',
        shortDescription: 'Counted as hidden',
        categoryId: visibleCategory.body.productCategory.id,
        isVisible: false,
      });
    createdProductIds.push(visibleProduct.body.product.id, hiddenProduct.body.product.id);
    const visiblePartner = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Dashboard visible partner',
        shortDescription: 'Counted as visible',
        isVisible: true,
      });
    const hiddenPartner = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Dashboard hidden partner',
        shortDescription: 'Counted as hidden',
        isVisible: false,
      });
    createdPartnerIds.push(visiblePartner.body.partner.id, hiddenPartner.body.partner.id);
    const visibleService = await request(app.getHttpServer())
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Dashboard visible service',
        description: 'Counted as visible',
        isVisible: true,
      });
    const hiddenService = await request(app.getHttpServer())
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Dashboard hidden service',
        description: 'Counted as hidden',
        isVisible: false,
      });
    createdServiceIds.push(visibleService.body.service.id, hiddenService.body.service.id);
    const actual = await request(app.getHttpServer())
      .get('/admin/dashboard')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(actual.status).toBe(200);
    expect(actual.body.statistics.products).toEqual({
      total: before.body.statistics.products.total + 2,
      visible: before.body.statistics.products.visible + 1,
      hidden: before.body.statistics.products.hidden + 1,
    });
    expect(actual.body.statistics.categories).toEqual({
      total: before.body.statistics.categories.total + 2,
      visible: before.body.statistics.categories.visible + 1,
      hidden: before.body.statistics.categories.hidden + 1,
    });
    expect(actual.body.statistics.partners).toEqual({
      total: before.body.statistics.partners.total + 2,
      visible: before.body.statistics.partners.visible + 1,
      hidden: before.body.statistics.partners.hidden + 1,
    });
    expect(actual.body.statistics.services).toEqual({
      total: before.body.statistics.services.total + 2,
      visible: before.body.statistics.services.visible + 1,
      hidden: before.body.statistics.services.hidden + 1,
    });
  });
});
