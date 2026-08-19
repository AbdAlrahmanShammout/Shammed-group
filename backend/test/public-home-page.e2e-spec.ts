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
    contactSectionTitle: 'Contact Us',
  };
}

describe('Public home page (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let prismaProviderService: PrismaProviderService;
  let visiblePartnerId: number;
  let hiddenPartnerId: number;
  let visibleCategoryId: number;
  let visibleProductId: number;
  let hiddenProductId: number;
  let visibleServiceId: number;
  let hiddenServiceId: number;

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
    await request(app.getHttpServer())
      .post('/admin/home-page')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(buildCreateHomePageBody());
    const visiblePartner = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Home Visible Partner',
        shortDescription: 'Shown on home',
        isVisible: true,
      });
    const hiddenPartner = await request(app.getHttpServer())
      .post('/admin/partner')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Home Hidden Partner',
        shortDescription: 'Hidden from home',
        isVisible: false,
      });
    visiblePartnerId = visiblePartner.body.partner.id;
    hiddenPartnerId = hiddenPartner.body.partner.id;
    const visibleCategory = await request(app.getHttpServer())
      .post('/admin/product-category')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Home visible category', isVisible: true });
    visibleCategoryId = visibleCategory.body.productCategory.id;
    const visibleProduct = await request(app.getHttpServer())
      .post('/admin/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Home Visible Product',
        shortDescription: 'Shown on home',
        categoryId: visibleCategoryId,
        isVisible: true,
      });
    const hiddenProduct = await request(app.getHttpServer())
      .post('/admin/product')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Home Hidden Product',
        shortDescription: 'Hidden from home',
        categoryId: visibleCategoryId,
        isVisible: false,
      });
    visibleProductId = visibleProduct.body.product.id;
    hiddenProductId = hiddenProduct.body.product.id;
    const visibleService = await request(app.getHttpServer())
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Home Visible Service',
        description: 'Shown on home',
        isVisible: true,
      });
    const hiddenService = await request(app.getHttpServer())
      .post('/admin/service')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Home Hidden Service',
        description: 'Hidden from home',
        isVisible: false,
      });
    visibleServiceId = visibleService.body.service.id;
    hiddenServiceId = hiddenService.body.service.id;
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/admin/product/${visibleProductId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/product/${hiddenProductId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/product-category/${visibleCategoryId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/partner/${visiblePartnerId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/partner/${hiddenPartnerId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/service/${visibleServiceId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await request(app.getHttpServer())
      .delete(`/admin/service/${hiddenServiceId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    await prismaProviderService.homePage.deleteMany();
    await app.close();
  });

  it('returns CMS fields plus visible catalog previews', async () => {
    const actual = await request(app.getHttpServer()).get('/home-page');
    expect(actual.status).toBe(200);
    expect(actual.body.homePage).toEqual(
      expect.objectContaining({
        heroTitle: 'Shammed Group',
        partnersSectionTitle: 'Our Partners',
      }),
    );
    expect(actual.body.homePage.partners).toBeUndefined();
    expect(actual.body.homePage.products).toBeUndefined();
    expect(actual.body.homePage.services).toBeUndefined();
    const partnerNames = actual.body.partners.map((partner: { name: string }) => partner.name);
    const productNames = actual.body.products.map((product: { name: string }) => product.name);
    const serviceTitles = actual.body.services.map((service: { title: string }) => service.title);
    expect(partnerNames).toContain('Home Visible Partner');
    expect(partnerNames).not.toContain('Home Hidden Partner');
    expect(productNames).toContain('Home Visible Product');
    expect(productNames).not.toContain('Home Hidden Product');
    expect(serviceTitles).toContain('Home Visible Service');
    expect(serviceTitles).not.toContain('Home Hidden Service');
  });
});
