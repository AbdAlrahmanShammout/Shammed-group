export type CreateAboutPageRepoInput = {
  readonly overview: string;
  readonly overviewImageMediaId: number | null;
  readonly vision: string;
  readonly mission: string;
  readonly values: string;
  readonly capabilities: string;
};

export type UpdateAboutPageRepoInput = {
  readonly id: number;
  readonly overview?: string;
  readonly overviewImageMediaId?: number | null;
  readonly vision?: string;
  readonly mission?: string;
  readonly values?: string;
  readonly capabilities?: string;
};
