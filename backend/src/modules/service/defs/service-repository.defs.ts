import { ServiceEntity } from '@/modules/service/entity/service.entity';

export type CreateServiceRepoInput = {
  readonly title: string;
  readonly description: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly imageMediaId: number | null;
};

export type UpdateServiceRepoInput = {
  readonly id: number;
  readonly title?: string;
  readonly description?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly imageMediaId?: number | null;
};

export type GetServicesRepoInput = {
  readonly isVisible?: boolean;
  readonly limit: number;
  readonly offset: number;
};

export type ServicePage = {
  readonly entities: ServiceEntity[];
  readonly total: number;
};
