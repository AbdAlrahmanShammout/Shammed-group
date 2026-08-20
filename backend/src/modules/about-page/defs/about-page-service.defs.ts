export type CreateAboutPageServiceInput = {
  readonly overview: string;
  readonly overviewImageMediaId?: number;
  readonly vision: string;
  readonly mission: string;
  readonly values: string;
  readonly capabilities: string;
};

export type UpdateAboutPageServiceInput = {
  readonly overview?: string;
  readonly overviewImageMediaId?: number | null;
  readonly vision?: string;
  readonly mission?: string;
  readonly values?: string;
  readonly capabilities?: string;
};
