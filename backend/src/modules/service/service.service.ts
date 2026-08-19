import { Injectable } from '@nestjs/common';

import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from '@/common/constants/policy.constants';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import { MediaService } from '@/modules/media/media.service';
import { ServicePage } from '@/modules/service/defs/service-repository.defs';
import {
  CreateServiceServiceInput,
  GetServicesServiceInput,
  UpdateServiceServiceInput,
} from '@/modules/service/defs/service-service.defs';
import { ServiceEntity } from '@/modules/service/entity/service.entity';
import { ServiceRepository } from '@/modules/service/repository/service.repository';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly mediaService: MediaService,
  ) {}

  async createService(input: CreateServiceServiceInput): Promise<ServiceEntity> {
    await this.assertMediaReference(input.imageMediaId);
    return this.serviceRepository.create({
      title: input.title,
      description: input.description,
      isVisible: input.isVisible ?? true,
      displayOrder: input.displayOrder ?? 0,
      imageMediaId: input.imageMediaId ?? null,
    });
  }

  async findServiceById(id: number): Promise<ServiceEntity | null> {
    return this.serviceRepository.findById(id);
  }

  async getServiceById(id: number): Promise<ServiceEntity> {
    const service = await this.findServiceById(id);
    if (!service) {
      throw new ResourceNotFoundException('Service', id);
    }
    return service;
  }

  async getPublicServiceById(id: number): Promise<ServiceEntity> {
    const service = await this.findServiceById(id);
    if (!service || !service.isVisible) {
      throw new ResourceNotFoundException('Service', id);
    }
    return service;
  }

  async findServices(input: GetServicesServiceInput = {}): Promise<ServicePage> {
    return this.serviceRepository.findAll({
      isVisible: input.isVisible,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async findPublicServices(input: GetServicesServiceInput = {}): Promise<ServicePage> {
    return this.serviceRepository.findAll({
      isVisible: true,
      limit: input.limit ?? DEFAULT_PAGE_LIMIT,
      offset: input.offset ?? DEFAULT_PAGE_OFFSET,
    });
  }

  async updateService(input: UpdateServiceServiceInput): Promise<ServiceEntity> {
    await this.getServiceById(input.id);
    await this.assertMediaReference(input.imageMediaId);
    return this.serviceRepository.update({
      id: input.id,
      title: input.title,
      description: input.description,
      isVisible: input.isVisible,
      displayOrder: input.displayOrder,
      imageMediaId: input.imageMediaId,
    });
  }

  async deleteService(id: number): Promise<void> {
    await this.getServiceById(id);
    await this.serviceRepository.delete(id);
  }

  private async assertMediaReference(mediaId?: number | null): Promise<void> {
    if (mediaId === undefined || mediaId === null) {
      return;
    }
    await this.mediaService.getMediaById(mediaId);
  }
}
