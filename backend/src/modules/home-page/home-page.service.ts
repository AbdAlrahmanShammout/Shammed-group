import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  CreateHomePageRepoInput,
  UpdateHomePageRepoInput,
} from '@/modules/home-page/defs/home-page-repository.defs';
import {
  CreateHomePageServiceInput,
  PublicHomePageReadModel,
  UpdateHomePageServiceInput,
} from '@/modules/home-page/defs/home-page-service.defs';
import { HomePageEntity } from '@/modules/home-page/entity/home-page.entity';
import { HomePageAlreadyExistsException } from '@/modules/home-page/exceptions/home-page-already-exists.exception';
import { HOME_PAGE_SINGLETON_KEY } from '@/modules/home-page/home-page.constants';
import { HomePageRepository } from '@/modules/home-page/repository/home-page.repository';
import { MediaService } from '@/modules/media/media.service';
import { PartnerService } from '@/modules/partner/partner.service';
import { ProductService } from '@/modules/product/product.service';
import { ServiceService } from '@/modules/service/service.service';

@Injectable()
export class HomePageService {
  constructor(
    private readonly homePageRepository: HomePageRepository,
    private readonly mediaService: MediaService,
    private readonly partnerService: PartnerService,
    private readonly productService: ProductService,
    private readonly serviceService: ServiceService,
  ) {}

  async createHomePage(input: CreateHomePageServiceInput): Promise<HomePageEntity> {
    await this.assertSingletonAbsent();
    await this.assertMediaReferences(input);
    return this.homePageRepository.create(this.toCreateRepoInput(input));
  }

  async findHomePage(): Promise<HomePageEntity | null> {
    return this.homePageRepository.findSingleton();
  }

  async getHomePage(): Promise<HomePageEntity> {
    const homePage = await this.findHomePage();
    if (!homePage) {
      throw new ResourceNotFoundException('HomePage', HOME_PAGE_SINGLETON_KEY);
    }
    return homePage;
  }

  async getPublicHomePage(): Promise<PublicHomePageReadModel> {
    const homePage = await this.getHomePage();
    const [partnersPage, productsPage, servicesPage] = await Promise.all([
      this.partnerService.findPublicPartners(),
      this.productService.findPublicProducts(),
      this.serviceService.findPublicServices(),
    ]);
    return {
      homePage,
      partners: partnersPage.entities,
      products: productsPage.entities,
      services: servicesPage.entities,
    };
  }

  async updateHomePage(input: UpdateHomePageServiceInput): Promise<HomePageEntity> {
    const existing = await this.getHomePage();
    await this.assertMediaReferences(input);
    return this.homePageRepository.update(this.toUpdateRepoInput(existing.id, input));
  }

  private async assertSingletonAbsent(): Promise<void> {
    const existing = await this.findHomePage();
    if (existing) {
      throw new HomePageAlreadyExistsException();
    }
  }

  private async assertMediaReferences(input: {
    heroImageMediaId?: number | null;
    aboutPreviewImageMediaId?: number | null;
    whyImageMediaId?: number | null;
  }): Promise<void> {
    await this.assertMediaReference(input.heroImageMediaId);
    await this.assertMediaReference(input.aboutPreviewImageMediaId);
    await this.assertMediaReference(input.whyImageMediaId);
  }

  private async assertMediaReference(mediaId?: number | null): Promise<void> {
    if (mediaId === undefined || mediaId === null) {
      return;
    }
    await this.mediaService.getMediaById(mediaId);
  }

  private toCreateRepoInput(input: CreateHomePageServiceInput): CreateHomePageRepoInput {
    return {
      heroTitle: input.heroTitle,
      heroDescription: input.heroDescription,
      heroImageMediaId: input.heroImageMediaId ?? null,
      primaryCtaText: input.primaryCtaText,
      primaryCtaUrl: input.primaryCtaUrl,
      secondaryCtaText: input.secondaryCtaText,
      secondaryCtaUrl: input.secondaryCtaUrl,
      aboutPreviewTitle: input.aboutPreviewTitle,
      aboutPreviewDescription: input.aboutPreviewDescription,
      aboutPreviewImageMediaId: input.aboutPreviewImageMediaId ?? null,
      aboutPreviewCtaText: input.aboutPreviewCtaText,
      aboutPreviewCtaUrl: input.aboutPreviewCtaUrl,
      partnersSectionTitle: input.partnersSectionTitle,
      partnersSectionDescription: input.partnersSectionDescription ?? null,
      productsSectionTitle: input.productsSectionTitle,
      productsSectionDescription: input.productsSectionDescription ?? null,
      servicesSectionTitle: input.servicesSectionTitle,
      servicesSectionDescription: input.servicesSectionDescription ?? null,
      whyTitle: input.whyTitle,
      whyDescription: input.whyDescription,
      whyImageMediaId: input.whyImageMediaId ?? null,
      contactSectionTitle: input.contactSectionTitle,
      contactSectionDescription: input.contactSectionDescription ?? null,
    };
  }

  private toUpdateRepoInput(
    id: number,
    input: UpdateHomePageServiceInput,
  ): UpdateHomePageRepoInput {
    return {
      id,
      heroTitle: input.heroTitle,
      heroDescription: input.heroDescription,
      heroImageMediaId: input.heroImageMediaId,
      primaryCtaText: input.primaryCtaText,
      primaryCtaUrl: input.primaryCtaUrl,
      secondaryCtaText: input.secondaryCtaText,
      secondaryCtaUrl: input.secondaryCtaUrl,
      aboutPreviewTitle: input.aboutPreviewTitle,
      aboutPreviewDescription: input.aboutPreviewDescription,
      aboutPreviewImageMediaId: input.aboutPreviewImageMediaId,
      aboutPreviewCtaText: input.aboutPreviewCtaText,
      aboutPreviewCtaUrl: input.aboutPreviewCtaUrl,
      partnersSectionTitle: input.partnersSectionTitle,
      partnersSectionDescription: input.partnersSectionDescription,
      productsSectionTitle: input.productsSectionTitle,
      productsSectionDescription: input.productsSectionDescription,
      servicesSectionTitle: input.servicesSectionTitle,
      servicesSectionDescription: input.servicesSectionDescription,
      whyTitle: input.whyTitle,
      whyDescription: input.whyDescription,
      whyImageMediaId: input.whyImageMediaId,
      contactSectionTitle: input.contactSectionTitle,
      contactSectionDescription: input.contactSectionDescription,
    };
  }
}
