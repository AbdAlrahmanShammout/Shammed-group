import { Injectable } from '@nestjs/common';

import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { ABOUT_PAGE_SINGLETON_KEY } from '@/modules/about-page/about-page.constants';
import {
  CreateAboutPageRepoInput,
  UpdateAboutPageRepoInput,
} from '@/modules/about-page/defs/about-page-repository.defs';
import {
  CreateAboutPageServiceInput,
  UpdateAboutPageServiceInput,
} from '@/modules/about-page/defs/about-page-service.defs';
import { AboutPageEntity } from '@/modules/about-page/entity/about-page.entity';
import { AboutPageAlreadyExistsException } from '@/modules/about-page/exceptions/about-page-already-exists.exception';
import { AboutPageRepository } from '@/modules/about-page/repository/about-page.repository';
import { MediaService } from '@/modules/media/media.service';

@Injectable()
export class AboutPageService {
  constructor(
    private readonly aboutPageRepository: AboutPageRepository,
    private readonly mediaService: MediaService,
  ) {}

  async createAboutPage(input: CreateAboutPageServiceInput): Promise<AboutPageEntity> {
    await this.assertSingletonAbsent();
    await this.assertMediaReference(input.overviewImageMediaId);
    return this.aboutPageRepository.create(this.toCreateRepoInput(input));
  }

  async findAboutPage(): Promise<AboutPageEntity | null> {
    return this.aboutPageRepository.findSingleton();
  }

  async getAboutPage(): Promise<AboutPageEntity> {
    const aboutPage = await this.findAboutPage();
    if (!aboutPage) {
      throw new ResourceNotFoundException('AboutPage', ABOUT_PAGE_SINGLETON_KEY);
    }
    return aboutPage;
  }

  async updateAboutPage(input: UpdateAboutPageServiceInput): Promise<AboutPageEntity> {
    const existing = await this.getAboutPage();
    await this.assertMediaReference(input.overviewImageMediaId);
    return this.aboutPageRepository.update(this.toUpdateRepoInput(existing.id, input));
  }

  private async assertSingletonAbsent(): Promise<void> {
    const existing = await this.findAboutPage();
    if (existing) {
      throw new AboutPageAlreadyExistsException();
    }
  }

  private async assertMediaReference(mediaId?: number | null): Promise<void> {
    if (mediaId === undefined || mediaId === null) {
      return;
    }
    await this.mediaService.getMediaById(mediaId);
  }

  private toCreateRepoInput(input: CreateAboutPageServiceInput): CreateAboutPageRepoInput {
    return {
      overview: input.overview,
      overviewImageMediaId: input.overviewImageMediaId ?? null,
      vision: input.vision,
      mission: input.mission,
      values: input.values,
      capabilities: input.capabilities,
    };
  }

  private toUpdateRepoInput(
    id: number,
    input: UpdateAboutPageServiceInput,
  ): UpdateAboutPageRepoInput {
    return {
      id,
      overview: input.overview,
      overviewImageMediaId: input.overviewImageMediaId,
      vision: input.vision,
      mission: input.mission,
      values: input.values,
      capabilities: input.capabilities,
    };
  }
}
