export type CreateServiceServiceInput = {
  readonly title: string;
  readonly description: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly imageMediaId?: number;
};

export type UpdateServiceServiceInput = {
  readonly id: number;
  readonly title?: string;
  readonly description?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly imageMediaId?: number | null;
};

export type GetServicesServiceInput = {
  readonly isVisible?: boolean;
  readonly limit?: number;
  readonly offset?: number;
};
